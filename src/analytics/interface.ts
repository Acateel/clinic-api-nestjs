import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorAppointmentsSummaryEntity } from 'src/database/view-entity/doctor-appointments-summary.entity';

export interface TopDoctorAnalytics {
  doctorId: number;
  appointmentsCount: number;
  productivityGrowth: number | null;
}

export type Department = Omit<
  DepartmentEntity,
  'doctors' | 'childDepartments'
> & {
  doctors?: DoctorAppointmentsSummaryEntity[];
  childDepartments?: Department[];
};

export interface DoctorAppointmentsWeeklySummary {
  [week: string]: DoctorAppointmentsSummaryEntity[];
}

export interface WeeklySummaryWithDepartmentHierarchy {
  [period: string]: DoctorAppointmentsSummaryEntity[] | Partial<Department>;
}
