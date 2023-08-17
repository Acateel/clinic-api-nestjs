import { DoctorResponseDto } from 'src/doctor/dto/response/doctorResponse.dto';
import { PatientResponseDto } from 'src/patient/dto/response/patientResponse.dto';

export class AppointmentDetailsResponseDto {
  readonly id!: string;
  readonly date!: Date;
  readonly patient!: PatientResponseDto;
  readonly patientId!: string;
  readonly doctor!: DoctorResponseDto;
  readonly doctorId!: string;
  readonly createdAt!: Date;
}
