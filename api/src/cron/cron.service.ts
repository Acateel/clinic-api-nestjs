import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotificationTypeEnum } from 'src/common/enum';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { UserNotificationEntity } from 'src/database/entity/user-notification.entity';
import { NotifyAppointmentUpcommingEvent } from 'src/notification/event';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(UserNotificationEntity)
    private readonly userNotificationRepository: Repository<UserNotificationEntity>,
    private readonly eventEmitterService: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async createUpcomingAppointmentsNotifications() {
    const startDate = Date.now();
    this.logger.debug('Cron started');

    const tomorrowMorningDate = new Date();
    tomorrowMorningDate.setDate(tomorrowMorningDate.getDate() + 1);
    tomorrowMorningDate.setHours(0, 0, 0, 0);

    const appointments = await this.appointmentRepository.find({
      relations: { patient: { user: true }, doctor: { user: true } },
      where: {
        startDate: MoreThan(tomorrowMorningDate),
      },
    });

    // TODO: queues, message brockers, maybe grpc microservice

    const notifications: UserNotificationEntity[] = [];

    appointments.forEach((appointment) => {
      const patientNotification = new UserNotificationEntity();
      patientNotification.type = UserNotificationTypeEnum.APPOINTMENT_UPCOMING;
      patientNotification.appointmentId = appointment.id;
      patientNotification.user = appointment.patient?.user;
      patientNotification.userId = appointment.patient!.userId;
      patientNotification.text = 'Appointment upcoming';
      notifications.push(patientNotification);

      const doctorNotification = new UserNotificationEntity();
      doctorNotification.type = UserNotificationTypeEnum.APPOINTMENT_UPCOMING;
      doctorNotification.appointmentId = appointment.id;
      doctorNotification.user = appointment.doctor?.user;
      doctorNotification.userId = appointment.doctor!.userId;
      doctorNotification.text = 'Appointment upcoming';
      notifications.push(doctorNotification);
    });

    await this.userNotificationRepository.insert(notifications);

    // TODO: maybe group data first, and then send
    notifications.forEach((notification) => {
      this.eventEmitterService.emit(
        NotifyAppointmentUpcommingEvent.EVENT_NAME,
        new NotifyAppointmentUpcommingEvent(
          notification.userId,
          notification.appointmentId!,
        ),
      );
    });

    const endDate = Date.now();
    this.logger.debug(`Cron finished after ${endDate - startDate} ms`);
  }
}
