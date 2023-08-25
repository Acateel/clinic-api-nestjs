import { RoleEnum } from 'src/common/enum';
import { PatientResponseDto } from 'src/patient/dto/response/patientResponse.dto';

export class UserDetailsResponseDto {
  readonly id!: number;
  readonly email!: string;
  readonly password!: string;
  readonly role!: RoleEnum;
  readonly firstName!: string;
  readonly resetToken!: string | null;
  readonly patients!: PatientResponseDto[];
  readonly patientIds!: number[];
  readonly createdAt!: Date;
}
