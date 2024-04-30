export class CommentResponseDto {
  readonly id!: number;
  readonly text!: string;
  readonly upVotes!: number;
  readonly downVotes!: number;
  readonly parentCommentId!: number | null;
  readonly reviewId!: number;
  readonly userId!: number;
}
