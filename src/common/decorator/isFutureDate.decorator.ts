import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsFutureDateConstraint } from '../util/isFutureDateConstraint';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsFutureDateConstraint,
    });
  };
}
