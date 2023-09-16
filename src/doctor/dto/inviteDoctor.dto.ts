import { Transform } from 'class-transformer';
import { IsEmail, Validate } from 'class-validator';
import { UniqueEmailConstraint } from 'src/common/constraint/uniqueEmailConstraint';

export class InviteDoctorDto {
  @IsEmail()
  @Validate(UniqueEmailConstraint, { message: 'Doctor is allready invited' })
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email!: string;
}
