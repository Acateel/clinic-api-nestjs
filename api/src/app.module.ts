import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { resolve } from 'path';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { AppConfig } from './common/interface';
import { ConfigurationModule } from './config/configuration.module';
import { CronModule } from './cron/cron.module';
import { DepartmentModule } from './department/department.module';
import { DoctorModule } from './doctor/doctor.module';
import { FileModule } from './file/file.module';
import { NotificationModule } from './notification/notification.module';
import { PatientModule } from './patient/patient.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    ThrottlerModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: resolve('public/'),
      serveStaticOptions: {
        index: false,
      },
      // exclude: ['/api*'],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
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
    CronModule,
    FileModule,
  ],
})
export class AppModule {}
