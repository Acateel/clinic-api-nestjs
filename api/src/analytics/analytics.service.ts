import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as datefns from 'date-fns';
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { DoctorAppointmentsSummaryEntity } from 'src/database/view-entity/doctor-appointments-summary.entity';
import { Repository } from 'typeorm';
import { GetDoctorAppointmentsOptionsDto } from './dto/get-doctor-appointments-options.dto';
import {
  Department,
  DoctorAppointmentsWeeklySummary,
  TopDoctorAnalytics,
  WeeklySummaryWithDepartmentHierarchy,
} from './interface';
import { GetDoctorAppointmentsResponseDto } from './response-dto/get-doctor-appointments-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async getDoctorAppointmentsSummary(
    options: GetDoctorAppointmentsOptionsDto,
  ): Promise<GetDoctorAppointmentsResponseDto> {
    const queryBuilder = this.doctorRepository.manager.createQueryBuilder(
      DoctorAppointmentsSummaryEntity,
      'doctor_appointments',
    );

    if (options.fromDate) {
      queryBuilder.andWhere('doctor_appointments.weekMinDate >= :fromDate', {
        fromDate: options.fromDate,
      });
    }

    if (options.toDate) {
      queryBuilder.andWhere('doctor_appointments.weekMinDate <= :toDate', {
        toDate: options.toDate,
      });
    }

    const currPeriodSummary = await queryBuilder.getMany();

    const currPeriodWeeklySummary =
      this.groupDoctorAppointmentsSummaryByWeeks(currPeriodSummary);

    const departments = await this.departmentRepository.find();

    const currPeriodSummaryWithDepartmentHierarchy =
      this.buildWeeklySummaryWithDepartmentHierarchy(
        departments as Department[],
        currPeriodWeeklySummary,
        options,
      );

    let prevPeriodSummary: DoctorAppointmentsSummaryEntity[] | null = null;
    let prevPeriodSummaryWithDepartmentHierarchy: WeeklySummaryWithDepartmentHierarchy | null =
      null;

    if (options.fromDate && options.toDate) {
      const periodDaysCount = datefns.differenceInCalendarDays(
        options.toDate,
        options.fromDate,
      );

      const queryBuilder = this.doctorRepository.manager
        .createQueryBuilder(
          DoctorAppointmentsSummaryEntity,
          'doctor_appointments',
        )
        .andWhere('doctor_appointments.weekMinDate >= :fromDate', {
          fromDate: datefns.subDays(options.fromDate, periodDaysCount),
        })
        .andWhere('doctor_appointments.weekMinDate <= :toDate', {
          toDate: datefns.subDays(options.toDate, periodDaysCount),
        });

      prevPeriodSummary = await queryBuilder.getMany();
      const prevPeriodWeeklySummary =
        this.groupDoctorAppointmentsSummaryByWeeks(prevPeriodSummary);
      prevPeriodSummaryWithDepartmentHierarchy =
        this.buildWeeklySummaryWithDepartmentHierarchy(
          departments as Department[],
          prevPeriodWeeklySummary,
          options,
        );
    }

    const topDoctorQueryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .select([
        'doctor.doctor_id as "doctorId"',
        'count(*)::integer as "appointmentCount"',
      ])
      .innerJoin('doctor.appointments', 'appointments')
      .groupBy('doctor.doctor_id')
      .orderBy('"appointmentCount"', 'DESC');

    const topDoctor =
      (await topDoctorQueryBuilder.getRawOne()) as TopDoctorAnalytics;

    topDoctor.productivityGrowth = prevPeriodSummary
      ? this.calcProductivityGrowthForDoctor(
          topDoctor.doctorId,
          prevPeriodSummary,
          currPeriodSummary,
        )
      : null;

    return {
      topDoctor,
      currPeriod: currPeriodSummaryWithDepartmentHierarchy,
      prevPeriod: prevPeriodSummaryWithDepartmentHierarchy ?? {},
    };
  }

  private groupDoctorAppointmentsSummaryByWeeks(
    summaryForPeriod: DoctorAppointmentsSummaryEntity[],
  ): DoctorAppointmentsWeeklySummary {
    return summaryForPeriod.reduce<DoctorAppointmentsWeeklySummary>(
      (acc, summary) => {
        const groupKey = datefns.format(
          summary.weekMinDate,
          `Y-MM:${datefns.getWeekOfMonth(summary.weekMinDate)}`,
        );

        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }

        acc[groupKey].push({
          ...summary,
        });

        return acc;
      },
      {},
    );
  }

  private buildWeeklySummaryWithDepartmentHierarchy(
    departments: Department[],
    weeklySummary: DoctorAppointmentsWeeklySummary,
    options: GetDoctorAppointmentsOptionsDto,
  ): WeeklySummaryWithDepartmentHierarchy {
    const hierarchies = Object.entries(weeklySummary).reduce<Department[]>(
      (acc, [period, doctorAppointmentsSummary]) => {
        const departmentsCopy: Department[] = JSON.parse(
          JSON.stringify(departments),
        );

        const departmentsMap = departmentsCopy.reduce((acc, department) => {
          department.period = period;

          return acc.set(department.id, department);
        }, new Map<number, Department>());
        const departmentsChildrenMap = departmentsCopy.reduce(
          (acc, department) => {
            if (!department.parentDepartmentId) {
              return acc;
            }

            const children = acc.get(department.parentDepartmentId) ?? [];
            children.push(department);

            return acc.set(department.parentDepartmentId, children);
          },
          new Map<number, Department[]>(),
        );

        Array.from(departmentsChildrenMap.values())
          .flatMap((depts) => depts)
          .forEach((department) => {
            department.parentDepartment = departmentsMap.get(
              department.parentDepartmentId ?? -1,
            );
          });

        const hierarchyRootDepartments: Department[] = [];

        departmentsCopy.forEach((department) => {
          department.period = period;

          if (department.parentDepartmentId === null) {
            hierarchyRootDepartments.push(department);
          }

          department.childDepartments =
            departmentsChildrenMap.get(department.id) ?? [];

          department.doctors = doctorAppointmentsSummary.filter((summary) =>
            summary.departmentIds.some((id) => id === department.id),
          );

          if (!department.doctors.length) {
            delete department.doctors;
          }
        });

        hierarchyRootDepartments.forEach((department) => {
          department.period = period;
        });

        acc.push(...hierarchyRootDepartments);

        return acc;
      },
      [],
    );

    if (options.filterDepartmentIds) {
      const hierarchyCopy = [...hierarchies];
      const tasksOnDepartmentsStack: Department[] = [...hierarchyCopy];

      while (tasksOnDepartmentsStack.length) {
        const department = tasksOnDepartmentsStack.pop()!;
        tasksOnDepartmentsStack.push(...department.childDepartments!);
        const isInFilter = options.filterDepartmentIds.includes(department.id);

        if (isInFilter) {
          continue;
        }

        const parentDepartment = department.parentDepartment;

        department.childDepartments!.forEach((dept) => {
          dept.parentDepartment = department.parentDepartment;
          dept.parentDepartmentId = department.parentDepartmentId;
        });

        if (!parentDepartment) {
          const index = hierarchies.findIndex(
            (dept) => dept.id === department.id,
          );

          if (index != -1) {
            hierarchies.splice(index, 1);
            hierarchies.push(...department.childDepartments!);
            tasksOnDepartmentsStack.push(...department.childDepartments!);
          }

          continue;
        }

        parentDepartment.childDepartments =
          parentDepartment.childDepartments!.filter(
            (dept) => dept.id !== department.id,
          );

        parentDepartment.childDepartments.push(...department.childDepartments!);
      }
    }

    if (!options.isIncludeEmptyValues) {
      const hierarchyCopy = [...hierarchies];
      const tasksOnDepartmentsStack: Department[] = [...hierarchyCopy];

      while (tasksOnDepartmentsStack.length) {
        const department = tasksOnDepartmentsStack.pop()!;

        const isEmptyDepartment =
          !department.childDepartments?.length && !department.doctors;

        if (!isEmptyDepartment) {
          tasksOnDepartmentsStack.push(...department.childDepartments!);

          continue;
        }

        const parentDepartment = department.parentDepartment;

        if (!parentDepartment) {
          const index = hierarchies.findIndex(
            (dept) => dept.id === department.id,
          );

          if (index != -1) {
            hierarchies.splice(index, 1);
          }

          continue;
        }

        parentDepartment.childDepartments =
          parentDepartment.childDepartments!.filter(
            (dept) => dept.id !== department.id,
          );

        tasksOnDepartmentsStack.push(parentDepartment);
      }
    }

    const tasksOnDepartmentsStack = [...hierarchies];

    while (tasksOnDepartmentsStack.length) {
      const department = tasksOnDepartmentsStack.pop()!;

      if (department.childDepartments?.length) {
        tasksOnDepartmentsStack.push(...department.childDepartments);
      }

      delete department.parentDepartment;
    }

    const result = hierarchies.reduce((acc, department) => {
      if (!acc[department.period!]) {
        acc[department.period!] = [];
      }

      acc[department.period!].push(
        this.omitDepartmentHierarchyDetails([department]),
      );

      return acc;
    }, {});

    Object.entries(result).forEach(([period, arr]) => {
      result[period] = Object.assign({}, ...(arr as any));
    });

    return result;
  }

  private omitDepartmentHierarchyDetails(
    departments: Department[],
  ): WeeklySummaryWithDepartmentHierarchy {
    const departmentsPartialInfo = {};

    for (const department of departments) {
      if (!departmentsPartialInfo[department.name]) {
        departmentsPartialInfo[department.name] = {};
      }

      const subdepartmentsPartialInfo = this.omitDepartmentHierarchyDetails(
        department.childDepartments ?? [],
      );

      if (department.doctors && !department.childDepartments?.length) {
        departmentsPartialInfo[department.name] = department.doctors;
      } else {
        departmentsPartialInfo[department.name] = subdepartmentsPartialInfo;
      }
    }

    return departmentsPartialInfo;
  }

  private calcProductivityGrowthForDoctor(
    doctorId: number,
    prevPeriod: DoctorAppointmentsSummaryEntity[],
    currPeriod: DoctorAppointmentsSummaryEntity[],
  ): number {
    const doctorPrevResults = prevPeriod.filter(
      (doctor) => doctor.doctorId === doctorId,
    );
    const prevMaxRes = Math.max(
      ...doctorPrevResults.map((res) => res.appointmentCount),
    );

    const doctorCurrResults = currPeriod.filter(
      (doctor) => doctor.doctorId === doctorId,
    );
    const currMaxRes = Math.max(
      ...doctorCurrResults.map((res) => res.appointmentCount),
    );

    return ((currMaxRes - prevMaxRes) / prevMaxRes) * 100;
  }
}
