import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class EndDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const isValidDate = value instanceof Date && !isNaN(value.getTime());
    if (!isValidDate) {
      return false;
    }
    return value.getTime() > args.object['startDate'].getTime();
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} must be after startDate`;
  }
}
