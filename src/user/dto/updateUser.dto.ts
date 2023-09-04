import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  Validate,
} from 'class-validator';
import { RoleEnum } from 'src/common/enum';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';
import { UniqueEmailConstraint } from 'src/common/constraint/uniqueEmailConstraint';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Validate(UniqueEmailConstraint)
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => bcrypt.hashSync(value as string, SALT_ROUNDS))
  readonly password?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly fullName?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly role?: RoleEnum;

  @IsOptional()
  readonly resetToken?: string | null;
}
