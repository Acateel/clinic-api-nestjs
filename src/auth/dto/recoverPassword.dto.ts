import { IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';
import { Transform } from 'class-transformer';

export class RecoverPasswordDto {
  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  password!: string;
}
