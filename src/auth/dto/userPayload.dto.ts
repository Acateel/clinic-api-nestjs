import { RoleEnum } from '../../common/enum';

export class UserPayloadDto {
  readonly id!: number;
  readonly email!: string;
  readonly role!: RoleEnum;
}
