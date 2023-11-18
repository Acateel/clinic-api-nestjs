import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { RegisterUserRoleEnum, UserRoleEnum } from 'src/common/enum';

export class RegisterUserDto {
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  readonly password!: string;

  @IsNotEmpty()
  readonly fullName!: string;

  @IsEnum(RegisterUserRoleEnum)
  @Transform(({ value }) => (value as string).toUpperCase())
  readonly role!: UserRoleEnum;
}
