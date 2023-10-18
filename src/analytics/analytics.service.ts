import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as datefns from 'date-fns';
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { DoctorAppointmentsSummaryEntity } from 'src/database/view-entity/doctor-appointments-summary.entity';
import { Repository } from 'typeorm';
import { GetDoctorAppointmentsOptionsDto } from './dto/get-doctor-appointments-options.dto';
import { TopDoctorAnalytics } from './interface';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async getForDoctorAppointmentsWithDepartmentHierarchy(
    options: GetDoctorAppointmentsOptionsDto,
  ) {
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

    if (options.doctorIds) {
      queryBuilder.andWhere('doctor_appointments.doctorId in (:...doctorIds)', {
        doctorIds: options.doctorIds,
      });
    }

    const currPeriodSummary = await queryBuilder.getMany();

    const currPeriodGroupedSummary =
      this.groupDoctorAppointmentsSummaryByWeeks(currPeriodSummary);

    const departments = await this.departmentRepository.find();

    for (const [period, summary] of Object.entries<
      DoctorAppointmentsSummaryEntity[]
    >(currPeriodGroupedSummary)) {
      const hierarchy = this.buildDepartmentHierarchyForSummary(
        departments,
        null,
        summary,
        options.isIncludeEmptyValues ?? false,
      );

      currPeriodGroupedSummary[period] =
        this.omitDepartmentHierarchyDetails(hierarchy);
    }

    const response = { currPeriodGroupedSummary } as any;

    let prevPeriodSummary: DoctorAppointmentsSummaryEntity[] | null = null;

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

      if (options.doctorIds) {
        queryBuilder.andWhere(
          'doctor_appointments.doctorId in (:...doctorIds)',
          {
            doctorIds: options.doctorIds,
          },
        );
      }

      prevPeriodSummary = await queryBuilder.getMany();

      const prevPeriodGroupedSummary =
        this.groupDoctorAppointmentsSummaryByWeeks(prevPeriodSummary);

      for (const [period, summary] of Object.entries<
        DoctorAppointmentsSummaryEntity[]
      >(prevPeriodGroupedSummary)) {
        const hierarchy = this.buildDepartmentHierarchyForSummary(
          departments,
          null,
          summary,
          options.isIncludeEmptyValues ?? false,
        );

        prevPeriodGroupedSummary[period] =
          this.omitDepartmentHierarchyDetails(hierarchy);
      }

      response.prevPeriodGroupedSummary = prevPeriodGroupedSummary;
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

    if (options.doctorIds) {
      topDoctorQueryBuilder.andWhere('doctor.doctor_id in (:...doctorIds)', {
        doctorIds: options.doctorIds,
      });
    }

    const topDoctor =
      (await topDoctorQueryBuilder.getRawOne()) as TopDoctorAnalytics;

    topDoctor.productivityGrowth = prevPeriodSummary
      ? this.calcProductivityGrowthForDoctor(
          topDoctor.doctorId,
          prevPeriodSummary,
          currPeriodSummary,
        )
      : null;

    response.topDoctor = topDoctor;

    return response;
  }

  private groupDoctorAppointmentsSummaryByWeeks(
    summaryForPeriod: DoctorAppointmentsSummaryEntity[],
  ) {
    return summaryForPeriod.reduce((acc, summary) => {
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
    }, {});
  }

  private buildDepartmentHierarchyForSummary(
    departments: DepartmentEntity[],
    parentDepartmentId: number | null = null,
    summary: DoctorAppointmentsSummaryEntity[],
    isIncludeEmptyValues: boolean,
  ) {
    const departmentsWithChildren: DepartmentEntity[] = [];

    for (const department of departments) {
      if (department.parentDepartmentId === parentDepartmentId) {
        const departmentWithChildren: DepartmentEntity = {
          ...department,
          childDepartments: this.buildDepartmentHierarchyForSummary(
            departments,
            department.id,
            summary,
            isIncludeEmptyValues,
          ),
        };

        if (
          departmentWithChildren.childDepartments &&
          departmentWithChildren.childDepartments.length === 0
        ) {
          departmentWithChildren.doctors = summary.filter(
            (s) => s.departmentId === department.id,
          ) as any;
        }

        departmentsWithChildren.push(departmentWithChildren);
      }
    }

    if (!isIncludeEmptyValues) {
      for (let i = 0; i < departmentsWithChildren.length; i++) {
        const department = departmentsWithChildren[i];

        if (
          department.doctors?.length === 0 &&
          department.childDepartments?.length === 0
        ) {
          departmentsWithChildren.splice(i, 1);
          i--;
        }
      }
    }

    return departmentsWithChildren;
  }

  private omitDepartmentHierarchyDetails(departments: DepartmentEntity[]) {
    const departmentsPartialInfo = {};

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
  ) {
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
