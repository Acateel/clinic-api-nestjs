import { IsPhoneNumber } from 'class-validator';

export class UpdatePatientDto {
  @IsPhoneNumber()
  readonly phoneNumber!: string;
}
