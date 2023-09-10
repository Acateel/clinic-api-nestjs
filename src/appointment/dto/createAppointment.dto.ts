import { IsNotEmpty, Validate } from 'class-validator';
import { FutureUtcDateConstraint } from 'src/common/constraint/futureUtcDateConstraint';

export class CreateAppointmentDto {
  @IsNotEmpty()
  readonly patientId!: number;

  @IsNotEmpty()
  readonly doctorId!: number;

  @Validate(FutureUtcDateConstraint)
  readonly startDate!: Date;

  @Validate(FutureUtcDateConstraint)
  readonly endDate!: Date;
}
