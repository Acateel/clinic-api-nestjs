import {
  TopDoctorAnalytics,
  WeeklySummaryWithDepartmentHierarchy,
} from '../interface';

export class GetDoctorAppointmentsResponseDto {
  readonly currPeriod!: WeeklySummaryWithDepartmentHierarchy;
  readonly prevPeriod!: WeeklySummaryWithDepartmentHierarchy;
  readonly topDoctor!: TopDoctorAnalytics;
}
