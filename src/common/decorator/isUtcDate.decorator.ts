import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function IsUtcDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUtcDateConstraint,
    });
  };
}

@ValidatorConstraint()
class IsUtcDateConstraint implements ValidatorConstraintInterface {
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
