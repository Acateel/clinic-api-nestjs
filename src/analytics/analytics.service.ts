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
    const departmentHierarchy: WeeklySummaryWithDepartmentHierarchy = {};

    for (const [period, doctorAppointmentsSummary] of Object.entries<
      DoctorAppointmentsSummaryEntity[]
    >(weeklySummary)) {
      const hierarchy: Department[] = [];
      const todoStack: Department[] = [];
      const departmentsMap: Map<number | null, Department> = new Map();

      departments.forEach((department) => {
        if (department.parentDepartmentId === null) {
          const departmentCopy = { ...department };
          hierarchy.push(departmentCopy);
          departmentsMap.set(departmentCopy.id, departmentCopy);
          todoStack.push(departmentCopy);
        }

        while (todoStack.length) {
          let parentDepartment = todoStack.pop()!;

          departments.forEach((childDepartment) => {
            if (childDepartment.parentDepartmentId !== parentDepartment.id) {
              return;
            }

            if (!parentDepartment.childDepartments) {
              parentDepartment.childDepartments = [];
            }

            const departmentCopy = { ...childDepartment };
            parentDepartment.childDepartments.push(departmentCopy);
            departmentsMap.set(departmentCopy.id, departmentCopy);
            todoStack.push(departmentCopy);
          });

          if (!parentDepartment.childDepartments) {
            parentDepartment.doctors = doctorAppointmentsSummary.filter(
              (summary) =>
                summary.departmentIds.some((id) => id === parentDepartment.id),
            );
          }

          if (!options.isIncludeEmptyValues) {
            while (
              (parentDepartment.doctors?.length === 0 &&
                !parentDepartment.childDepartments) ||
              parentDepartment.childDepartments?.length === 0
            ) {
              if (parentDepartment.parentDepartmentId === null) {
                if (parentDepartment.childDepartments?.length === 0) {
                  parentDepartment.doctors = doctorAppointmentsSummary.filter(
                    (summary) =>
                      summary.departmentIds.some(
                        (id) => id === parentDepartment.id,
                      ),
                  );
                }

                if (!parentDepartment.doctors) {
                  const idx = hierarchy.findIndex(
                    (department) => department.id === parentDepartment.id,
                  );
                  hierarchy.splice(idx, 1);
                }
              }

              const parentOfParent = departmentsMap.get(
                parentDepartment.parentDepartmentId,
              );

              if (!parentOfParent) {
                break;
              }

              parentOfParent.childDepartments =
                parentOfParent.childDepartments?.filter(
                  (child) => child.id !== parentDepartment.id,
                );
              parentDepartment = parentOfParent;
            }
          }
        }
      });

      departmentHierarchy[period] =
        this.omitDepartmentHierarchyDetails(hierarchy);
    }

    return departmentHierarchy;
  }

  private buildDepartmentHierarchyForSummary(
    departments: Department[],
    parentDepartmentId: number | null = null,
    summary: DoctorAppointmentsSummaryEntity[],
    options: GetDoctorAppointmentsOptionsDto,
  ): Department[] {
    const departmentsWithChildren: Department[] = [];

    for (const department of departments) {
      if (department.parentDepartmentId === parentDepartmentId) {
        const departmentWithChildren: Department = {
          ...department,
          childDepartments: this.buildDepartmentHierarchyForSummary(
            departments,
            department.id,
            summary,
            options,
          ),
        };

        if (departmentWithChildren.childDepartments?.length === 0) {
          departmentWithChildren.doctors = summary.filter((summary) =>
            summary.departmentIds.some((id) => id === department.id),
          );
        }

        departmentsWithChildren.push(departmentWithChildren);
      }
    }

    if (!options.isIncludeEmptyValues) {
      let i = departmentsWithChildren.length;
      while (i--) {
        const department = departmentsWithChildren[i];

        const isDepartmentAndSubdepartmentDontHaveDoctors =
          department.doctors?.length === 0 &&
          department.childDepartments?.length === 0;

        if (isDepartmentAndSubdepartmentDontHaveDoctors) {
          departmentsWithChildren.splice(i, 1);
        }
      }
    }

    return departmentsWithChildren;
  }

  private omitDepartmentHierarchyDetails(
    departments: Department[],
  ): WeeklySummaryWithDepartmentHierarchy {
    const departmentsPartialInfo: WeeklySummaryWithDepartmentHierarchy = {};

    for (const department of departments) {
      if (!departmentsPartialInfo[department.name]) {
        departmentsPartialInfo[department.name] = {};
      }

      const subdepartmentsPartialInfo = this.omitDepartmentHierarchyDetails(
        department.childDepartments ?? [],
      );

      if (department.doctors) {
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
