import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email!: string;

  @IsNotEmpty()
  readonly password!: string;
}
