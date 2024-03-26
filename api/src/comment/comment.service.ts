import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEventsEnum, VoteEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentVoteEntity } from 'src/database/entity/comment-vote.entity';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

Injectable();
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentVoteEntity)
    private readonly commentVoteRepository: Repository<CommentVoteEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateCommentDto,
    payload: AccessTokenPayload,
  ): Promise<CommentEntity> {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!dto.parentCommentId && !dto.reviewId) {
      throw new BadRequestException(
        'One of parentCommentId and reviewId parameters required',
      );
    }

    const comment = new CommentEntity();
    comment.user = user;

    if (dto.reviewId) {
      const review = await this.reviewRepository.findOneBy({
        id: dto.reviewId,
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      comment.review = review;
    }

    comment.text = dto.text;

    if (dto.parentCommentId) {
      const quoteComment = await this.commentRepository.findOne({
        where: { id: dto.parentCommentId },
        relations: { user: true },
      });

      if (!quoteComment) {
        throw new NotFoundException('Quote comment not found');
      }

      comment.parentCommentId = dto.parentCommentId;
      comment.text = `${quoteComment.user!.fullName}, ${dto.text}`;
    }

    const insertRes = await this.commentRepository.insert(comment);
    const commentId = insertRes.identifiers[0].id;
    const commentDetails = await this.commentRepository.findOneBy({
      id: commentId,
    });

    this.eventEmitter.emit(ReviewEventsEnum.ADD_COMMENT, commentDetails);

    return commentDetails!;
  }

  async like(id: number, payload: AccessTokenPayload): Promise<void> {
    return this.vote(id, payload, 'like');
  }

  async dislike(id: number, payload: AccessTokenPayload): Promise<void> {
    return this.vote(id, payload, 'dislike');
  }

  private async vote(
    id: number,
    payload: AccessTokenPayload,
    voteType: 'like' | 'dislike',
  ): Promise<void> {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userVote = await this.commentVoteRepository.findOneBy({
      commentId: id,
      userId: payload.id,
    });

    if (userVote) {
      if (
        (voteType === 'like' && userVote.vote === VoteEnum.LIKE) ||
        (voteType === 'dislike' && userVote.vote === VoteEnum.DISLIKE)
      ) {
        throw new ConflictException('Already voted');
      }

      await this.commentRepository.manager.connection.transaction(
        async (entityManager) => {
          const commentVoteRepository =
            entityManager.getRepository(CommentVoteEntity);
          commentVoteRepository.delete({
            userId: userVote.userId,
            commentId: comment.id,
          });

          const commentRepository = entityManager.getRepository(CommentEntity);
          if (voteType === 'like') {
            commentRepository.decrement({ id }, 'upVotes', 1);
          } else {
            commentRepository.decrement({ id }, 'downVotes', 1);
          }
        },
      );

      const updatedComment = await this.commentRepository.findOneBy({ id });

      this.eventEmitter.emit(ReviewEventsEnum.VOTE, updatedComment);

      return;
    }

    await this.commentRepository.manager.connection.transaction(
      async (entityManager) => {
        const commentVoteRepository =
          entityManager.getRepository(CommentVoteEntity);
        const commentVote = new CommentVoteEntity();
        commentVote.commentId = id;
        commentVote.userId = payload.id;
        commentVote.vote =
          voteType === 'like' ? VoteEnum.LIKE : VoteEnum.DISLIKE;
        commentVoteRepository.insert(commentVote);

        const commentRepository = entityManager.getRepository(CommentEntity);
        if (voteType === 'like') {
          commentRepository.increment({ id }, 'upVotes', 1);
        } else {
          commentRepository.increment({ id }, 'downVotes', 1);
        }
      },
    );

    const updatedComment = await this.commentRepository.findOneBy({ id });

    this.eventEmitter.emit(ReviewEventsEnum.VOTE, updatedComment);
  }
}
