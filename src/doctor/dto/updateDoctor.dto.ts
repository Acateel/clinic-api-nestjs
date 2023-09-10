import { IsArray, IsOptional, Validate, ValidateNested } from 'class-validator';
import { DoctorAvailableSlotDto } from './doctorAvailableSlot.dto';
import { Type } from 'class-transformer';
import { DatesNotOverlapConstraint } from 'src/common/constraint/datesNotOverlapConstraint';

export class UpdateDoctorDto {
  @IsOptional()
  readonly speciality?: string;

  @IsOptional()
  @IsArray()
  @Type(() => DoctorAvailableSlotDto)
  @Validate(DatesNotOverlapConstraint)
  @ValidateNested({ each: true })
  readonly availableSlots?: DoctorAvailableSlotDto[];
}
