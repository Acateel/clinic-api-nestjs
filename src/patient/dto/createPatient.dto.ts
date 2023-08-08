import { IsPhoneNumber } from 'class-validator';
import { IsUniquePhoneNumber } from 'src/common/decorator/isUniquePhoneNumber.decorator';

export class CreatePatientDto {
  @IsPhoneNumber()
  @IsUniquePhoneNumber()
  readonly phoneNumber!: string;
}
