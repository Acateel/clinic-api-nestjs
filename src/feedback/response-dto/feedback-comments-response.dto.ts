import { FeedbackTypeEnum } from 'src/common/enum';
import { UserResponseDto } from 'src/user/response-dto/user-response.dto';

export class FeedbackCommentsResponseDto {
  user!: UserResponseDto;
  upVotes!: number;
  text!: string | null;
  feedbackType!: FeedbackTypeEnum;
  doctorId!: number | null;
  userId!: number;
  parentCommentId!: number;
}
