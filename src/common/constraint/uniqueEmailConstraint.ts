import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ async: true })
export class UniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: unknown) {
    try {
      await this.userService.getByEmail(value as string);
      return false;
    } catch (error) {
      return true;
    }
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} adress is allready in use`;
  }
}
