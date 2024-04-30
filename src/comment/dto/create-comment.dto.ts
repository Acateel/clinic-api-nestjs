import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsSingleSource } from 'src/common/constraint/comment-single-source.constraint';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly text!: string;

  @IsOptional()
  @IsNumber()
  @IsSingleSource('parentCommentId')
  readonly reviewId!: number;

  @IsOptional()
  @IsNumber()
  readonly parentCommentId?: number;
}
