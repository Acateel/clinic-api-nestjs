import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  Validate,
} from 'class-validator';
import { UserRoleEnum } from 'src/common/enum';
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
  @IsEnum(UserRoleEnum)
  readonly role?: UserRoleEnum;

  // IMPROVE: data below is not directly related to user and should be defined in separate database tables: reset_token, refresh_token
  // but for simplicity the data is stored directly in user entity.
  // So the data and operations on that data should not be considered as available *buisiness* operations on user,
  // but rather as temporary additional user duties.

  readonly resetToken?: string | null;

  readonly refreshToken?: string | null;
}
