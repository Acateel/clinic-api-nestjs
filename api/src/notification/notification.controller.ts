import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/common/enum';
import { ReviewCommentedEvent } from 'src/common/interface';
import { SseConnectionInterceptor } from 'src/sse/interceptor/sse-connection.interceptor';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @UseInterceptors(SseConnectionInterceptor)
  getSse() {}

  @OnEvent('notification.reviewCommented')
  handleReviewCommentedEvent(payload: ReviewCommentedEvent) {
    return this.notificationService.reviewCommented(payload);
  }

  @OnEvent('notification.likeComment')
  handleLikeComment() {}
}
