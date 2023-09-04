import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PatientService } from 'src/patient/patient.service';

@ValidatorConstraint({ async: true })
export class UniquePhoneConstraint implements ValidatorConstraintInterface {
  constructor(private readonly patientService: PatientService) {}

  async validate(value: unknown) {
    try {
      await this.patientService.getByPhoneNumber(value as string);
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} is allready in use`;
  }
}
