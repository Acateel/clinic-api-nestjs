import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PatientService } from 'src/patient/patient.service';

export function IsUniquePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniquePhoneNumberConstraint,
    });
  };
}

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
      await this.patientService.getByPhoneNumber(value as string);
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Phone number is allready in use';
  }
}
