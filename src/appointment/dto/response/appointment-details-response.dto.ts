import { DoctorResponseDto } from 'src/doctor/dto/response/doctor-response.dto';
import { PatientResponseDto } from 'src/patient/dto/response/patient-response.dto';

export class AppointmentDetailsResponseDto {
  readonly id!: number;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly patient!: PatientResponseDto;
  readonly patientId!: number;
  readonly doctor!: DoctorResponseDto;
  readonly doctorId!: number;
  readonly createdAt!: Date;
}
