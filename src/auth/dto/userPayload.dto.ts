import { RoleEnum } from '../../common/enum';

export class UserPayloadDto {
  readonly sub!: number;
  readonly email!: string;
  readonly role!: RoleEnum;
}
