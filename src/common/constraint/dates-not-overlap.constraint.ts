import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { checkIntervalsOverlap } from '../util';
import { DoctorAvailableSlotDto } from '../dto/doctor-available-slot.dto';

@ValidatorConstraint()
export class DatesNotOverlapConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const dateIntervals = value as DoctorAvailableSlotDto[];
    return !dateIntervals.some((date, index, array) => {
      if (index === 0) {
        return false;
      }
      return checkIntervalsOverlap(date, array[index - 1]);
    });
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} must not overlap`;
  }
}
