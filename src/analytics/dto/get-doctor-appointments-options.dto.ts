import { Transform, Type } from 'class-transformer';
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
  @Type(() => Array<number>)
  @Transform(({ value }) =>
    Array.isArray(value) ? value : Array(value).map((v) => Number(v)),
  )
  readonly filterDepartmentIds?: number[];

  @IsOptional()
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => value === 'true')
  readonly isIncludeEmptyValues?: boolean;
}
