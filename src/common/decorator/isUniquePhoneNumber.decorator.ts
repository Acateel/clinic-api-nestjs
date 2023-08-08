import { ValidationOptions, registerDecorator } from 'class-validator';
import { UniquePhoneNumberConstraint } from '../util/uniquePhoneNumberConstraint';

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
