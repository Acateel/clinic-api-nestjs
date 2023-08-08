import { IsPhoneNumber } from 'class-validator';
import { IsUniquePhoneNumber } from 'src/common/decorator/isUniquePhoneNumber.decorator';

export class UpdatePatientDto {
  @IsPhoneNumber()
  @IsUniquePhoneNumber()
  readonly phoneNumber!: string;
}
