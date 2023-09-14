import { UserRoleEnum } from 'src/common/enum';

export class UserResponseDto {
  readonly id!: number;
  readonly email!: string;
  readonly role!: UserRoleEnum;
  readonly fullName!: string;
  readonly patientIds!: number[];
}
