import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class GetDoctorAppointmentsOptionsDto {
  @IsOptional()
  @IsDate()
  readonly fromDate?: Date;

  @IsOptional()
  @IsDate()
  readonly toDate?: Date;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  readonly filterDoctorIds?: number[];

  @IsOptional()
  @IsBoolean()
  readonly isIncludeEmptyValues?: boolean;
}
