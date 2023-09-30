import { Validate } from 'class-validator';
import { EndDateConstraint } from 'src/common/constraint/end-date-constraint';
import { FutureUtcDateConstraint } from 'src/common/constraint/future-utc-date-constraint';

export class DoctorAvailableSlotDto {
  @Validate(FutureUtcDateConstraint)
  readonly startDate!: Date;

  @Validate(EndDateConstraint)
  readonly endDate!: Date;
}
