import { IsEmail } from 'class-validator';

export class InviteDoctorDto {
  @IsEmail()
  readonly email!: string;
}
