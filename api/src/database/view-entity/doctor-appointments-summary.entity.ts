import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { DoctorEntity } from '../entity/doctor.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder(DoctorEntity, 'doctor')
      .select([
        'ROW_NUMBER() OVER (ORDER BY 1)::integer as summary_id',
        'doctor.doctor_id',
        'full_name',
        'array_agg(distinct department_id) as department_ids',
        'count(*)::integer as appointment_count',
        'extract (week from start_date)::integer as week_number',
        'min(start_date) as week_min_date',
      ])
      .innerJoin('doctor.user', 'user')
      .innerJoin('doctor.departments', 'department')
      .innerJoin('doctor.appointments', 'appointment')
      .groupBy('doctor.doctor_id, full_name, week_number')
      .orderBy('week_number', 'ASC')
      .addOrderBy('appointment_count', 'DESC'),
})
export class DoctorAppointmentsSummaryEntity {
  @ViewColumn()
  summaryId!: number;

  @ViewColumn()
  doctorId!: number;

  @ViewColumn()
  fullName!: string;

  @ViewColumn()
  departmentIds!: number[];

  @ViewColumn()
  appointmentCount!: number;

  @ViewColumn()
  weekNumber!: number;

  @ViewColumn()
  weekMinDate!: Date;
}
