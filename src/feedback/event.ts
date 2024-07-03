import { FeedbackEntity } from 'src/database/entity/feedback.entity';

// TODO: use enum vs static const
export class FeedbackVotedEvent {
  static readonly EVENT_NAME = 'feedback.voted';

  constructor(readonly feedbackEntity: FeedbackEntity) {}
}
