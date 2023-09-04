import { IsOptional, Validate } from 'class-validator';
import { FutureUtcDateConstraint } from 'src/common/constraint/futureUtcDateConstraint';

export class UpdateAppointmentDto {
  @IsOptional()
  public readonly patientId?: number;

  @IsOptional()
  public readonly doctorId?: number;

  @IsOptional()
  @Validate(FutureUtcDateConstraint)
  public readonly date?: Date;
}
