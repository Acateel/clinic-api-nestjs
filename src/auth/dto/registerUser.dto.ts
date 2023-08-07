import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoleEnum } from 'src/common/enum';

export class RegisterUserDto {
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  readonly password!: string;

  @IsNotEmpty()
  readonly firstName!: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  readonly role?: UserRoleEnum;
}
