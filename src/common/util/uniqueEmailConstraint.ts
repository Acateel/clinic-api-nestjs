import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ async: true })
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(
    value: unknown,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    try {
      await this.userService.find({ email: value as string });
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email adress is allready in use';
  }
}
