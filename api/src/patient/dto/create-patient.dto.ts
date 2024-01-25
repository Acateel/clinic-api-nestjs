import { IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsPhoneNumber()
  readonly phoneNumber!: string;
}
