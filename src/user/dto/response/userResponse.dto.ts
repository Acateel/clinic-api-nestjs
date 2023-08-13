import { RoleEnum } from 'src/common/enum';

export class UserResponseDto {
  readonly id!: string;
  readonly email!: string;
  readonly role!: RoleEnum;
  readonly firstName!: string;
  readonly patientIds!: string[];
}
