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
import { RestrictResponseEntityToOwnUserInterceptor } from './common/interceptor/RestrictResponseEntityToOwnUser.interceptor';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { UniqueEmailConstraint } from './common/decorator/isUniqueEmail.decorator';
import { UniquePhoneNumberConstraint } from './common/decorator/isUniquePhoneNumber.decorator';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
  ],
  providers: [
    UniqueEmailConstraint,
    UniquePhoneNumberConstraint,
    RestrictResponseEntityToOwnUserInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(typeOrmFindOptionsQueryMapperMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
