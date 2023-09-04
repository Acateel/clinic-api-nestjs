import { IsPhoneNumber, Validate } from 'class-validator';
import { UniquePhoneConstraint } from 'src/common/constraint/uniquePhoneConstraint';

export class UpdatePatientDto {
  @IsPhoneNumber()
  @Validate(UniquePhoneConstraint)
  readonly phoneNumber!: string;
}
