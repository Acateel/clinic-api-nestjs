import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint()
export class FutureUtcDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const isValidDate = value instanceof Date && !isNaN(value.getTime());
    if (!isValidDate) {
      return false;
    }
    return DateTime.fromJSDate(value).toUTC() > DateTime.utc();
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} must be utc date string in future`;
  }
}
