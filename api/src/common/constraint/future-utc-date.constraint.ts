import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class FutureUtcDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const isValidDate = value instanceof Date && !isNaN(value.getTime());
    if (!isValidDate) {
      return false;
    }
    return value.getTime() > Date.now();
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} must be utc date string in future`;
  }
}
