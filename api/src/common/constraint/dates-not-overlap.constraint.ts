import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DoctorAvailableSlotDto } from 'src/doctor-available-slot/doctor-available-slot.dto';
import { checkIntervalsOverlap } from '../util';

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
