import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUtcDateConstraint } from '../util/isUtcDateConstraint';

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
