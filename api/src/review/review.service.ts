import { Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, fromEvent, map, merge, of } from 'rxjs';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { NotifyReviewCommentedEvent } from 'src/notification/event';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment.dto';
import { ReviewCommentedEvent, ReviewVotedEvent } from './event';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  get(): Promise<ReviewEntity[]> {
    return this.reviewRepository.find();
  }

  async getById(id: number, maxDepth: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: { comments: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (maxDepth <= 0) {
      return review;
    }

    if (!review.comments) {
      return review;
    }

    const commentTree: CommentEntity[] = [];
    const commentMap = new Map<number, CommentEntity>();

    review.comments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    review.comments.forEach((comment) => {
      if (comment.parentCommentId === null) {
        commentTree.push(comment);
        return;
      }

      const parentComment = commentMap.get(comment.parentCommentId)!;
      let lastParent = parentComment;

      while (this.getDepth(lastParent, commentMap) >= maxDepth) {
        if (!lastParent.parentCommentId) {
          break;
        }

        lastParent = commentMap.get(lastParent.parentCommentId)!;
      }

      if (parentComment.id != lastParent.id) {
        comment.parentCommentId = lastParent.id;
      }

      lastParent.childComments = lastParent.childComments || [];
      lastParent.childComments.push(comment);
    });

    review.comments = commentTree;

    return review;
  }

  getDepth(
    comment: CommentEntity,
    commentMap: Map<number, CommentEntity>,
  ): number {
    let depth = 0;
    let currentComment = comment;

    while (currentComment.parentCommentId !== null) {
      depth++;
      const parentComment = commentMap.get(currentComment.parentCommentId);

      if (!parentComment) {
        return depth;
      }

      currentComment = parentComment;
    }

    return depth;
  }

  async addComment(
    reviewId: number,
    dto: AddCommentDto,
    payload: AccessTokenPayload,
  ): Promise<CommentEntity> {
    const review = await this.reviewRepository.findOneBy({ id: reviewId });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const comment = new CommentEntity();
    comment.text = dto.text;
    comment.review = review;

    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    comment.user = user;

    const insertResult = await this.commentRepository.insert(comment);
    const commentId = insertResult.identifiers[0].id;
    const commentDetails = await this.commentRepository.findOneBy({
      id: commentId,
    });

    this.eventEmitter.emit(
      ReviewCommentedEvent.EVENT_NAME,
      new ReviewCommentedEvent(commentDetails!),
    );
    this.eventEmitter.emit(
      NotifyReviewCommentedEvent.EVENT_NAME,
      new NotifyReviewCommentedEvent(user.id, review.id, commentId),
    );

    return commentDetails!;
  }

  async getByIdSse(
    id: number,
    maxDepth: number,
  ): Promise<Observable<MessageEvent>> {
    const review = await this.getById(id, maxDepth);

    return merge(
      of(review).pipe(
        map<ReviewEntity, MessageEvent>((comment) => ({
          type: 'getById',
          data: comment,
        })),
      ),
      fromEvent(
        this.eventEmitter,
        ReviewCommentedEvent.EVENT_NAME,
        () => ReviewCommentedEvent,
      ).pipe(
        map((comment) => ({
          type: 'addComment',
          data: comment,
        })),
      ),
      fromEvent(
        this.eventEmitter,
        ReviewVotedEvent.EVENT_NAME,
        () => ReviewVotedEvent,
      ).pipe(
        map((vote) => ({
          type: 'vote',
          data: vote,
        })),
      ),
    );
  }
}
