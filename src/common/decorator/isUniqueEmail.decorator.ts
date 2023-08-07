import { ValidationOptions, registerDecorator } from 'class-validator';
import { UniqueEmailConstraint } from '../util/uniqueEmailConstraint';

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailConstraint,
    });
  };
}
