import { IsOptional } from 'class-validator';

export class GetPatientQueryDto {
  @IsOptional()
  readonly phoneNumber?: string;

  @IsOptional()
  readonly fullName?: string;
}
