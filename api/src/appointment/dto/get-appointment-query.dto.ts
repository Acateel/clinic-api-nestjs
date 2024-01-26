import { IsOptional } from 'class-validator';

export class GetAppointmentQueryDto {
  @IsOptional()
  readonly doctor?: number;

  @IsOptional()
  readonly patient?: number;
}
