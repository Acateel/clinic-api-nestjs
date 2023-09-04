import { Validate } from 'class-validator';
import { EndDateConstraint } from 'src/common/constraint/endDateConstraint';
import { FutureUtcDateConstraint } from 'src/common/constraint/futureUtcDateConstraint';

export class DoctorAvailableSlotDto {
  @Validate(FutureUtcDateConstraint)
  readonly startDate!: Date;

  @Validate(EndDateConstraint)
  readonly endDate!: Date;
}
