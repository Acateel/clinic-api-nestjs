import { IsDateString, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/decorator/isFutureDate.decorator';
import { IsUtcDate } from 'src/common/decorator/isUtcDate.decorator';

export class UpdateAppointmentDto {
  @IsOptional()
  public readonly patientId?: number;

  @IsOptional()
  public readonly doctorId?: number;

  @IsOptional()
  @IsDateString()
  @IsUtcDate()
  @IsFutureDate()
  public readonly date?: string;
}
