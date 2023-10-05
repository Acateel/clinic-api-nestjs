import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as datefns from 'date-fns';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  async getTopDoctorsByPeriodReport(options: {
    fromDate: Date;
    toDate: Date;
    doctorIds?: number[];
  }) {
    const currentPeriod = await this.getDataForPeriod(
      options.fromDate,
      options.toDate,
      options.doctorIds,
    );

    const periodDaysCount = datefns.differenceInCalendarDays(
      options.toDate,
      options.fromDate,
    );
    const previousPeriod = await this.getDataForPeriod(
      datefns.subDays(options.fromDate, periodDaysCount),
      datefns.subDays(options.toDate, periodDaysCount),
      options.doctorIds,
    );

    const currentPeriodGroupedByWeeks = this.groupByWeeks(currentPeriod);

    const topDoctor = currentPeriod[0];
    topDoctor.bestInWeeks = this.getDoctorBestWeeks(
      topDoctor,
      currentPeriodGroupedByWeeks,
    );
    topDoctor.demandGrowth = this.calcInDemandGrowthForDoctor(
      topDoctor,
      previousPeriod,
    );

    return {
      topDoctor,
      currentPeriod: currentPeriodGroupedByWeeks,
      previousPeriod: this.groupByWeeks(previousPeriod),
    };
  }

  private getDataForPeriod(fromDate: Date, toDate: Date, doctorIds?: number[]) {
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .select('doctor.doctor_id, user.full_name')
      .addSelect(`date_trunc('week', start_date::date) AS week_date`)
      .addSelect(
        'COUNT(appointment.appointment_id)::integer AS appointment_count',
      )
      .innerJoin('doctor.appointments', 'appointment')
      .innerJoin('doctor.user', 'user')
      .andWhere(
        `date_trunc('week', start_date::date) BETWEEN :fromDate AND :toDate`,
        { fromDate, toDate },
      )
      .groupBy('doctor.doctor_id, user.full_name, week_date')
      .orderBy('week_date', 'ASC')
      .addOrderBy('COUNT(appointment.appointment_id)::integer', 'DESC');

    if (doctorIds) {
      queryBuilder.andWhere('doctor.id IN (:...doctorIds)', { doctorIds });
    }

    return queryBuilder.getRawMany();
  }

  private groupByWeeks(period) {
    return period.reduce((period, doctorAppointmentsInfo) => {
      const year = doctorAppointmentsInfo.week_date.getFullYear();
      const month = doctorAppointmentsInfo.week_date.getMonth() + 1;
      const groupKey = `${year}-${month} week ${datefns.getWeekOfMonth(
        doctorAppointmentsInfo.week_date,
      )}`;

      if (!period[groupKey]?.length) {
        period[groupKey] = [];
      }

      delete doctorAppointmentsInfo.week_date;
      period[groupKey].push({
        ...doctorAppointmentsInfo,
      });
      return period;
    }, {});
  }

  private getDoctorBestWeeks(doctor, period) {
    const bestWeeks = {};
    for (const [week, doctors] of Object.entries(period)) {
      const doctorsInfo = doctors as Array<any>;
      const topDoctorOfWeek = doctorsInfo[0];
      if (topDoctorOfWeek.doctor_id === doctor.doctor_id) {
        bestWeeks[week] = topDoctorOfWeek.appointment_count;
      }
    }
    return bestWeeks;
  }

  private calcInDemandGrowthForDoctor(doctor, prevPeriod) {
    const topPrevPeriodResults = prevPeriod.filter(
      (d) => d.doctor_id === doctor.doctor_id,
    );
    const prevMaxRes = Math.max(
      ...topPrevPeriodResults.map((res) => res.appointment_count),
    );

    return ((doctor.appointment_count - prevMaxRes) / prevMaxRes) * 100;
  }
}
