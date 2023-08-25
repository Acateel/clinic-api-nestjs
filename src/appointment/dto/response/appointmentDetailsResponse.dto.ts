import { DoctorResponseDto } from 'src/doctor/dto/response/doctorResponse.dto';
import { PatientResponseDto } from 'src/patient/dto/response/patientResponse.dto';

export class AppointmentDetailsResponseDto {
  readonly id!: number;
  readonly date!: Date;
  readonly patient!: PatientResponseDto;
  readonly patientId!: number;
  readonly doctor!: DoctorResponseDto;
  readonly doctorId!: number;
  readonly createdAt!: Date;
}
