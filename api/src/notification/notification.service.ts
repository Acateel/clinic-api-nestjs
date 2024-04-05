import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewCommentedEvent } from 'src/common/interface';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewNotificationEntity } from 'src/database/entity/review-notification.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { SseService } from 'src/sse/sse.service';
import { Repository } from 'typeorm';

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

  async reviewCommented(payload: ReviewCommentedEvent) {
    const review = await this.reviewRepository.findOne({
      where: { id: payload.reviewId },
    });

    if (!review) {
      // TODO: handle
      return;
    }

    const comment = await this.commentRepository.findOneBy({
      id: payload.commentId,
    });

    if (!comment) {
      // TODO: handle
      return;
    }

    const notification = await this.reviewNotificationRepository.save({
      type: 'commented',
      review,
      user: { id: review.userId },
      comment,
    });

    this.sseService.send(review.userId, {
      data: notification,
      type: 'notification.reviewCommented',
    });
  }
}
