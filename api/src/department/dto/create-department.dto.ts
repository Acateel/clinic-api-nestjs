import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly parentDepartmentId?: number;
}
