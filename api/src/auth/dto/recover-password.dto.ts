import * as bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { SALT_ROUNDS } from 'src/common/constant';

export class RecoverPasswordDto {
  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  readonly password!: string;
}
