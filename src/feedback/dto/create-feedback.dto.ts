import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FeedbackTypeEnum } from 'src/common/enum';

export class CreateFeedbackDto {
  @IsOptional()
  @IsNotEmpty()
  readonly text?: string;

  @IsEnum(FeedbackTypeEnum)
  readonly feedbackType!: FeedbackTypeEnum;

  @IsOptional()
  @IsNotEmpty()
  readonly doctorId?: number;

  @IsOptional()
  @IsNotEmpty()
  readonly parentCommentId?: number;
}
