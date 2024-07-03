import { FeedbackTypeEnum } from 'src/common/enum';

export class CreateFeedbackResponseDto {
  readonly id!: number;
  readonly likeCount!: number;
  readonly dislikeCount!: number;
  readonly text!: string | null;
  readonly feedbackType!: FeedbackTypeEnum;
  readonly doctorId!: number | null;
  readonly userId!: number;
  readonly parentCommentId!: number | null;
}
