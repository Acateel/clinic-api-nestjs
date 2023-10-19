import { UserRoleEnum } from 'src/common/enum';
import { DoctorResponseDto } from 'src/doctor/response-dto/doctor-response.dto';
import { PatientResponseDto } from 'src/patient/response-dto/patient-response.dto';

export class UserDetailsResponseDto {
  readonly id!: number;
  readonly email!: string;
  readonly password!: string;
  readonly role!: UserRoleEnum;
  readonly fullName!: string;
  readonly resetToken!: string | null;
  readonly patients!: PatientResponseDto[];
  readonly patientIds!: number[];
  readonly doctors!: DoctorResponseDto[];
  readonly doctorIds!: number[];
  readonly createdAt!: Date;
}
