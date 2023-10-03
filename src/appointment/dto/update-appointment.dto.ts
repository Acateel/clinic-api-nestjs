import { IsOptional, Validate } from 'class-validator';
import { FutureUtcDateConstraint } from 'src/common/constraint/future-utc-date.constraint';

export class UpdateAppointmentDto {
  @IsOptional()
  readonly patientId?: number;

  @IsOptional()
  readonly doctorId?: number;

  @IsOptional()
  @Validate(FutureUtcDateConstraint)
  readonly startDate?: Date;

  @IsOptional()
  @Validate(FutureUtcDateConstraint)
  readonly endDate?: Date;
}
