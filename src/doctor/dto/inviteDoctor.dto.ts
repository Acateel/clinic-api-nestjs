import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class InviteDoctorDto {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email!: string;
}
