import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { resolve } from 'path';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { AppConfig } from './common/interface';
import { ConfigurationModule } from './config/configuration.module';
import { DepartmentModule } from './department/department.module';
import { DoctorModule } from './doctor/doctor.module';
import { FileModule } from './file/file.module';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigurationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/graphql/schema.gql',
    }),
    ThrottlerModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: resolve('public/'),
      serveStaticOptions: {
        index: false,
      },
      // exclude: ['/api*'],
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
    FeedbackModule,
    FileModule,
  ],
})
export class AppModule {}
