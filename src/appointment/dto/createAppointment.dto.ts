import { IsDateString, IsNotEmpty } from 'class-validator';
import { IsFutureDate } from 'src/common/decorator/isFutureDate.decorator';
import { IsUtcDate } from 'src/common/decorator/isUtcDate.decorator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  readonly patientId!: number;

  @IsNotEmpty()
  readonly doctorId!: number;

  @IsDateString()
  @IsUtcDate()
  @IsFutureDate()
  readonly date!: string;
}
