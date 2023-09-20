import { Transform } from 'class-transformer';
import { IsOptional, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/common/enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly password?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly fullName?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  @Transform(({ value }) => (value as string).toUpperCase())
  readonly role?: UserRoleEnum;
}
