import { IsArray, IsDateString, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/decorator/isFutureDate.decorator';

export class UpdateDoctorDto {
  @IsOptional()
  readonly speciality?: string;

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  @IsFutureDate({ each: true })
  readonly availableSlots?: string[];
}
