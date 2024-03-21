import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint()
export class CommentSingleSourceConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly secondSourceFieldName: string) {}

  validate(value: unknown, args: ValidationArguments) {
    if (value) {
      return !args.object[this.secondSourceFieldName];
    }
    return true;
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} and ${this.secondSourceFieldName} can not exist toogether`;
  }
}

export function IsSingleSource(
  secondSourceFieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new CommentSingleSourceConstraint(secondSourceFieldName),
    });
  };
}
