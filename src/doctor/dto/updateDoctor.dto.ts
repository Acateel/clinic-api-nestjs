import { IsArray, IsDateString, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/decorator/isFutureDate.decorator';
import { IsUtcDate } from 'src/common/decorator/isUtcDate.decorator';

export class UpdateDoctorDto {
  @IsOptional()
  readonly speciality?: string;

  @IsOptional()
  @IsArray()
  @IsUtcDate({ each: true })
  @IsDateString({}, { each: true })
  @IsFutureDate({ each: true })
  readonly availableSlots?: string[];
}
