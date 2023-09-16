import { IsOptional } from 'class-validator';

export class UpdateDoctorProfileDto {
  @IsOptional()
  speciality?: string;
}
