import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class InviteUserDto {
  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  password!: string;
}
