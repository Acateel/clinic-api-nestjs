import { IsArray, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsFutureDate } from 'src/common/decorator/isFutureDate.decorator';
import { IsUtcDate } from 'src/common/decorator/isUtcDate.decorator';

export class CreateDoctorDto {
  @IsNotEmpty()
  readonly speciality!: string;

  @IsOptional()
  @IsArray()
  @IsUtcDate({ each: true })
  @IsDateString({}, { each: true })
  @IsFutureDate({ each: true })
  readonly availableSlots?: string[];
}
