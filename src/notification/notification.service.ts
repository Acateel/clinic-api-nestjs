import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotificationTypeEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentEntity } from 'src/database/entity/comment.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserNotificationEntity } from 'src/database/entity/user-notification.entity';
import { SseService } from 'src/sse/sse.service';
import { Repository } from 'typeorm';
import {
  NotifyAppointmentUpcommingEvent,
  NotifyReviewCommentedEvent,
} from './event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserNotificationEntity)
    private readonly userNotificationRepository: Repository<UserNotificationEntity>,
    private readonly sseService: SseService,
  ) {}

  async getSse(payload: AccessTokenPayload) {
    const notifications = await this.userNotificationRepository.find({
      where: {
        userId: payload.id,
        isSeen: false,
      },
      take: 20,
      order: { id: 'DESC' },
    });
    this.sseService.send(payload.id, { type: 'get', data: notifications });
  }

  async reviewCommented(payload: NotifyReviewCommentedEvent) {
    const review = await this.reviewRepository.findOne({
      where: { id: payload.reviewId },
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

    const notification = await this.userNotificationRepository.save({
      type: UserNotificationTypeEnum.REVIEW_COMMENTED,
      review,
      user: { id: review.userId },
      comment,
    });

    this.sseService.send(review.userId, {
      type: NotifyReviewCommentedEvent.EVENT_NAME,
      data: notification,
    });
  }

  async appointmentUpcoming(payload: NotifyAppointmentUpcommingEvent) {
    // TODO: send array of data
    this.sseService.send(payload.userId, {
      type: NotifyAppointmentUpcommingEvent.EVENT_NAME,
      data: payload,
    });
  }
}
