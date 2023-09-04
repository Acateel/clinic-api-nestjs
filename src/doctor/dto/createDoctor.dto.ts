import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DoctorAvailableSlotDto } from './doctorAvailableSlot.dto';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
  @IsNotEmpty()
  readonly speciality!: string;

  @IsOptional()
  @IsArray()
  @Type(() => DoctorAvailableSlotDto)
  @ValidateNested({ each: true })
  readonly availableSlots?: DoctorAvailableSlotDto[];
}
