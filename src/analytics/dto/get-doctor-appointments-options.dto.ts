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
  readonly doctorIds?: number[];

  @IsOptional()
  @IsBoolean()
  readonly isIncludeEmptyValues?: boolean;
}
