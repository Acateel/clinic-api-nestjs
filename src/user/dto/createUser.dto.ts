import { Transform } from 'class-transformer';
import { IsOptional, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { IsUniqueEmail } from 'src/common/decorator/isUniqueEmail.decorator';
import { RoleEnum } from 'src/common/enum';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class CreateUserDto {
  @IsEmail()
  @IsUniqueEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email!: string;

  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  readonly password!: string;

  @IsNotEmpty()
  readonly firstName!: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;
}
