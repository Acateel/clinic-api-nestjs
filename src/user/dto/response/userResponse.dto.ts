import { RoleEnum } from 'src/common/enum';

export class UserResponseDto {
  readonly id!: number;
  readonly email!: string;
  readonly role!: RoleEnum;
  readonly fullName!: string;
  readonly patientIds!: number[];
}
