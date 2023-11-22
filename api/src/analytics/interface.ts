import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorAppointmentsSummaryEntity } from 'src/database/view-entity/doctor-appointments-summary.entity';

export interface TopDoctorAnalytics {
  doctorId: number;
  appointmentsCount: number;
  productivityGrowth: number | null;
}

export type Department = Omit<
  DepartmentEntity,
  'doctors' | 'childDepartments' | 'parentDepartment'
> & {
  doctors?: DoctorAppointmentsSummaryEntity[];
  childDepartments?: Department[];
  parentDepartment?: Department;
  period?: string;
};

export interface DoctorAppointmentsWeeklySummary {
  [week: string]: DoctorAppointmentsSummaryEntity[];
}

export interface WeeklySummaryWithDepartmentHierarchy {
  [period: string]: Department[];
}
