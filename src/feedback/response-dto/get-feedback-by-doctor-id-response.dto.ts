import { FeedbackTypeEnum } from 'src/common/enum';
import { UserResponseDto } from 'src/user/response-dto/user-response.dto';
import { FeedbackCommentsResponseDto } from './feedback-comments-response.dto';

export class GetFeedbackByDoctorIdResponseDto {
  readonly user!: UserResponseDto;
  readonly upVotes!: number;
  readonly text!: string | null;
  readonly feedbackType!: FeedbackTypeEnum;
  readonly doctorId!: number;
  readonly userId!: number;
  readonly parentCommentId!: number | null;
  readonly comments!: FeedbackCommentsResponseDto[];
}
