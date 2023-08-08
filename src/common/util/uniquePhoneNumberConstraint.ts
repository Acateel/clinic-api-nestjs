import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniquePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly patientService: PatientService) {}

  async validate(
    value: unknown,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    try {
      await this.patientService.find({ phoneNumber: value as string });
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Phone number is allready in use';
  }
}
