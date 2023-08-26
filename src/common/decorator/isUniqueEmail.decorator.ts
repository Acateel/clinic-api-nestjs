import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

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

// TODO: place in single file?
@ValidatorConstraint({ async: true })
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(
    value: unknown,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    try {
      await this.userService.getByEmail(value as string);
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email adress is allready in use';
  }
}
