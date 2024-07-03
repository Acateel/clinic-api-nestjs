import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenPayload } from 'src/common/interface';
import { UserNotificationEntity } from 'src/database/entity/user-notification.entity';
import { SseService } from 'src/sse/sse.service';
import { Repository } from 'typeorm';
import { NotifyAppointmentUpcommingEvent } from './event';

@Injectable()
export class NotificationService {
  constructor(
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

  async appointmentUpcoming(payload: NotifyAppointmentUpcommingEvent) {
    // TODO: send array of data
    this.sseService.send(payload.userId, {
      type: NotifyAppointmentUpcommingEvent.EVENT_NAME,
      data: payload,
    });
  }
}
