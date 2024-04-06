import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/common/interface';
import { AppointmentEntity } from './entity/appointment.entity';
import { CommentVoteEntity } from './entity/comment-vote.entity';
import { CommentEntity } from './entity/comment.entity';
import { DepartmentEntity } from './entity/department.entity';
import { DoctorAvailableSlotEntity } from './entity/doctor-available-slot.entity';
import { DoctorEntity } from './entity/doctor.entity';
import { PatientEntity } from './entity/patient.entity';
import { ReviewEntity } from './entity/review.entity';
import { UserNotificationEntity } from './entity/user-notification.entity';
import { UserEntity } from './entity/user.entity';
import { DoctorAppointmentsSummaryEntity } from './view-entity/doctor-appointments-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('database'),
    }),
    TypeOrmModule.forFeature([
      PatientEntity,
      UserEntity,
      DoctorEntity,
      AppointmentEntity,
      DoctorAvailableSlotEntity,
      DepartmentEntity,
      DoctorAppointmentsSummaryEntity,
      ReviewEntity,
      CommentEntity,
      CommentVoteEntity,
      UserNotificationEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
