import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { SseConnectionInterceptor } from 'src/sse/interceptor/sse-connection.interceptor';
import {
  NotifyAppointmentUpcommingEvent,
  NotifyReviewCommentedEvent,
} from './event';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // TODO: exception filter
  @Get('sse')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @UseInterceptors(SseConnectionInterceptor)
  getSse(@User() user: AccessTokenPayload) {
    this.notificationService.getSse(user);
  }

  @OnEvent(NotifyReviewCommentedEvent.EVENT_NAME)
  handleReviewCommentedEvent(payload: NotifyReviewCommentedEvent) {
    return this.notificationService.reviewCommented(payload);
  }

  @OnEvent(NotifyAppointmentUpcommingEvent.EVENT_NAME)
  handleAppointmentUpcomingEvent(payload: NotifyAppointmentUpcommingEvent) {
    return this.notificationService.appointmentUpcoming(payload);
  }
}
