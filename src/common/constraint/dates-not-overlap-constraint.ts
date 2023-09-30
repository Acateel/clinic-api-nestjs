import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DoctorAvailableSlotDto } from 'src/doctor/dto/doctor-available-slot.dto';
import { checkIntervalsOverlap } from '../util';

@ValidatorConstraint()
export class DatesNotOverlapConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    const dateIntervals = value as DoctorAvailableSlotDto[];
    for (let i = 0; i < dateIntervals.length - 1; i++) {
      for (let j = i + 1; j < dateIntervals.length; j++) {
        if (checkIntervalsOverlap(dateIntervals[i], dateIntervals[j])) {
          return false;
        }
      }
    }
    return true;
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property} must not overlap`;
  }
}
