import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import { RoleEnum } from 'src/common/enum';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';
import { UniqueEmailConstraint } from 'src/common/constraint/uniqueEmailConstraint';

export class RegisterUserDto {
  @IsEmail()
  @Validate(UniqueEmailConstraint)
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
