import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmFindOptionsQueryMapperMiddleware } from './common/middleware/TypeOrmFindOptionsQueryMapper.middleware';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfigFactory } from './config/appConfigFactory';
import { AppConfigValidationService } from './config/appConfigValidation.service';
import { UniqueEmailConstraint } from './common/constraint/uniqueEmailConstraint';
import { UniquePhoneConstraint } from './common/constraint/uniquePhoneConstraint';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigFactory],
      validate: AppConfigValidationService.validate,
    }),
    ThrottlerModule.forRoot(),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
  ],
  providers: [UniqueEmailConstraint, UniquePhoneConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(typeOrmFindOptionsQueryMapperMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
