import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/common/enum';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';
import { IsUniqueEmail } from 'src/common/decorator/isUniqueEmail.decorator';

export class RegisterUserDto {
  @IsEmail()
  @IsUniqueEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email!: string;

  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  readonly password!: string;

  @IsNotEmpty()
  readonly fullName!: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;
}
