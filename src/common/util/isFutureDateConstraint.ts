import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint()
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(
    value: unknown,
    validationArguments?: ValidationArguments | undefined,
  ): boolean | Promise<boolean> {
    const utcDate = value as string;
    const inputDate = DateTime.fromISO(utcDate, { zone: 'utc' });

    if (!inputDate.isValid) {
      return false;
    }

    const currentDate = DateTime.utc();

    return inputDate > currentDate;
  }

  defaultMessage(): string {
    return 'Date can not be in the past';
  }
}
