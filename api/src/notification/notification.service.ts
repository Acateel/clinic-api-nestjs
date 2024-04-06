import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewNotificationTypeEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewNotificationEntity } from 'src/database/entity/review-notification.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { SseService } from 'src/sse/sse.service';
import { Repository } from 'typeorm';
import { NotifyReviewCommentedEvent } from './event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ReviewNotificationEntity)
    private readonly reviewNotificationRepository: Repository<ReviewNotificationEntity>,
    private readonly sseService: SseService,
  ) {}

  async get(payload: AccessTokenPayload) {
    const notifications = await this.reviewNotificationRepository.findBy({
      userId: payload.id,
      isSeen: false,
    });
    this.sseService.send(payload.id, { type: 'get', data: notifications });
  }

  async reviewCommented(payload: NotifyReviewCommentedEvent) {
    const review = await this.reviewRepository.findOne({
      where: { id: -1 },
    });

    if (!review) {
      // TODO: check how to catch exceptions
      throw new NotFoundException('Review not found');
    }

    const comment = await this.commentRepository.findOneBy({
      id: payload.commentId,
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const notification = await this.reviewNotificationRepository.save({
      type: ReviewNotificationTypeEnum.COMMENTED,
      review,
      user: { id: review.userId },
      comment,
    });

    this.sseService.send(review.userId, {
      type: NotifyReviewCommentedEvent.EVENT_NAME,
      data: notification,
    });
  }
}
