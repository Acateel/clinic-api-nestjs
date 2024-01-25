import { IsOptional, Max, Min } from 'class-validator';

export class AddReviewDto {
  @Min(1)
  @Max(5)
  readonly rating!: number;

  @IsOptional()
  readonly comment?: string;
}
