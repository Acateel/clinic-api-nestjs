import { RoleEnum } from '../../common/enum';

export class UserPayloadDto {
  readonly sub!: string;
  readonly email!: string;
  readonly role!: RoleEnum;
}
