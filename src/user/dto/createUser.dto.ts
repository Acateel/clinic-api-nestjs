import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/common/enum';

export class CreateUserDto {
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  readonly password!: string;

  @IsNotEmpty()
  readonly fullName!: string;

  @IsEnum(UserRoleEnum)
  @Transform(({ value }) => (value as string).toUpperCase())
  readonly role!: UserRoleEnum;
}
