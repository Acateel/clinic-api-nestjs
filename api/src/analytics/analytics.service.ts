import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as datefns from 'date-fns';
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { DoctorAppointmentsSummaryEntity } from 'src/database/view-entity/doctor-appointments-summary.entity';
import { DataSource, Repository } from 'typeorm';
import { GetDoctorAppointmentsQueryDto } from './dto/get-doctor-appointments-query.dto';
import {
  Department,
  DoctorAppointmentsWeeklySummary,
  TopDoctorAnalytics,
  WeeklySummaryWithDepartmentHierarchy,
} from './interface';
import { GetDoctorAppointmentsResponseDto } from './response-dto/get-doctor-appointments-response.dto';
import { GetNewUsersCountResponseDto } from './response-dto/get-new-users-count-response-dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getDoctorAppointmentsSummary(
    query: GetDoctorAppointmentsQueryDto,
  ): Promise<GetDoctorAppointmentsResponseDto> {
    const queryBuilder = this.doctorRepository.manager.createQueryBuilder(
      DoctorAppointmentsSummaryEntity,
      'doctor_appointments',
    );

    if (query.fromDate) {
      queryBuilder.andWhere('doctor_appointments.weekMinDate >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('doctor_appointments.weekMinDate <= :toDate', {
        toDate: query.toDate,
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
        query,
      );

    let prevPeriodSummary: DoctorAppointmentsSummaryEntity[] | null = null;
    let prevPeriodSummaryWithDepartmentHierarchy: WeeklySummaryWithDepartmentHierarchy | null =
      null;

    if (query.fromDate && query.toDate) {
      const periodDaysCount = datefns.differenceInCalendarDays(
        query.toDate,
        query.fromDate,
      );

      const queryBuilder = this.doctorRepository.manager
        .createQueryBuilder(
          DoctorAppointmentsSummaryEntity,
          'doctor_appointments',
        )
        .andWhere('doctor_appointments.weekMinDate >= :fromDate', {
          fromDate: datefns.subDays(query.fromDate, periodDaysCount),
        })
        .andWhere('doctor_appointments.weekMinDate <= :toDate', {
          toDate: datefns.subDays(query.toDate, periodDaysCount),
        });

      prevPeriodSummary = await queryBuilder.getMany();
      const prevPeriodWeeklySummary =
        this.groupDoctorAppointmentsSummaryByWeeks(prevPeriodSummary);
      prevPeriodSummaryWithDepartmentHierarchy =
        this.buildWeeklySummaryWithDepartmentHierarchy(
          departments as Department[],
          prevPeriodWeeklySummary,
          query,
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
    options: GetDoctorAppointmentsQueryDto,
  ): WeeklySummaryWithDepartmentHierarchy {
    let hierarchiesRootDepartments = Object.entries(weeklySummary).reduce<
      Department[]
    >((acc, [period, doctorAppointmentsSummary]) => {
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
    }, []);

    const tasksOnDepartmentsStack: Department[] =
      options.filterDepartmentIds || !options.isIncludeEmptyValues
        ? [...hierarchiesRootDepartments]
        : [];

    while (tasksOnDepartmentsStack.length) {
      const department = tasksOnDepartmentsStack.pop()!;
      tasksOnDepartmentsStack.push(...department.childDepartments!);

      if (options.filterDepartmentIds) {
        const isInFilter = options.filterDepartmentIds.includes(department.id);

        if (!isInFilter) {
          const parentDepartment = department.parentDepartment;

          department.childDepartments!.forEach((dept) => {
            dept.parentDepartment = department.parentDepartment;
            dept.parentDepartmentId = department.parentDepartmentId;
          });

          if (!parentDepartment) {
            const index = hierarchiesRootDepartments.findIndex(
              (dept) => dept.id === department.id,
            );

            if (index != -1) {
              hierarchiesRootDepartments.splice(index, 1);
              hierarchiesRootDepartments.push(...department.childDepartments!);
              tasksOnDepartmentsStack.push(...department.childDepartments!);
            }
          } else {
            parentDepartment.childDepartments =
              parentDepartment.childDepartments!.filter(
                (dept) => dept.id !== department.id,
              );

            parentDepartment.childDepartments.push(
              ...department.childDepartments!,
            );
          }
        }
      }

      if (!options.isIncludeEmptyValues) {
        const isEmptyDepartment =
          !department.childDepartments?.length && !department.doctors;

        if (!isEmptyDepartment) {
          continue;
        }

        const parentDepartment = department.parentDepartment;

        if (!parentDepartment) {
          const index = hierarchiesRootDepartments.findIndex(
            (dept) =>
              dept.id === department.id && dept.period === department.period,
          );

          if (index != -1) {
            hierarchiesRootDepartments.splice(index, 1);
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

    hierarchiesRootDepartments = hierarchiesRootDepartments.filter(
      (dept) => dept.childDepartments!.length > 0 || dept.doctors,
    );

    const departmentsStack = [...hierarchiesRootDepartments];

    while (departmentsStack.length) {
      const department = departmentsStack.pop()!;

      if (department.childDepartments?.length) {
        departmentsStack.push(...department.childDepartments);
      }

      delete department.parentDepartment;
    }

    const result = hierarchiesRootDepartments.reduce((acc, department) => {
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

  async getNewUsersCount(): Promise<GetNewUsersCountResponseDto> {
    // TODO: Try without dataSource
    const usersCount = await this.dataSource
      .createQueryBuilder()
      .select([
        'day.count::INT AS "prevDayCount"',
        `
        (
          SELECT COUNT(*) FROM public.user 
          WHERE EXTRACT(DAY FROM created_at) = EXTRACT(DAY FROM CURRENT_DATE) AND
            DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )::INT as "currDayCount"
        `,
        `
        (
          SELECT COUNT(*) FROM public.user 
          WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM (CURRENT_DATE - INTERVAL '1 month')) AND
            EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        )::INT as "prevMonthCount"
        `,
        `
        (
          SELECT COUNT(*) FROM public.user 
          WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND
            EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        )::INT as "currMonthCount"
        `,
        `
        (
          SELECT COUNT(*) FROM public.user 
          WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '1 year'))
        )::INT as "prevYearCount"
        `,
        `
        (
          SELECT COUNT(*) FROM public.user 
          WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        )::INT as "currYearCount"
        `,
      ])
      .from(
        (subQuery) =>
          subQuery
            .select('COUNT(*)')
            .from(UserEntity, 'user')
            .where(
              `
              EXTRACT(DAY FROM created_at) = EXTRACT(DAY FROM (CURRENT_DATE - INTERVAL '1 day')) AND
                DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
              `,
            ),
        'day',
      )
      .execute();

    return usersCount;
  }
}
