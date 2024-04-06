import { CommentEntity } from 'src/database/entity/comment.entity';

export class ReviewVotedEvent {
  static readonly EVENT_NAME = 'review.voted';

  constructor(readonly commentEntity: CommentEntity) {}
}

export class ReviewCommentedEvent {
  static readonly EVENT_NAME = 'review.commented';

  constructor(readonly commentEntity: CommentEntity) {}
}
