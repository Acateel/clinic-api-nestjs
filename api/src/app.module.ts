import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { AppConfig } from './common/interface';
import { ConfigurationModule } from './config/configuration.module';
import { DepartmentModule } from './department/department.module';
import { DoctorModule } from './doctor/doctor.module';
import { NotificationModule } from './notification/notification.module';
import { PatientModule } from './patient/patient.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    ThrottlerModule.forRoot(),
    EventEmitterModule.forRoot(),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('i18n'),
      resolvers: [AcceptLanguageResolver],
    }),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    DepartmentModule,
    AnalyticsModule,
    ReviewModule,
    CommentModule,
    NotificationModule,
  ],
})
export class AppModule {}
