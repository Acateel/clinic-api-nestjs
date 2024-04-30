import { IsOptional } from 'class-validator';

export class GetDoctorQueryDto {
  @IsOptional()
  readonly speciality?: string;

  @IsOptional()
  readonly fullName?: string;

  @IsOptional()
  readonly sort?: string;

  @IsOptional()
  readonly limit?: number;
}
