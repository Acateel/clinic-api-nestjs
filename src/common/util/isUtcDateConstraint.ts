import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsUtcDateConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments | undefined,
  ): boolean | Promise<boolean> {
    const isoDate = value as string;
    return isoDate.endsWith('Z');
  }

  defaultMessage(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    return 'Date must not have time offset';
  }
}
