import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmFindOptionsQueryMapperMiddleware } from '../common/middleware/TypeOrmFindOptionsQueryMapper.middleware';
import { AuthModule } from '../auth/auth.module';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { UniqueEmailConstraint } from '../common/decorator/isUniqueEmail.decorator';
import { UniquePhoneNumberConstraint } from '../common/decorator/isUniquePhoneNumber.decorator';
import { jwtConfig } from './config/jwt.config';
import { databaseConfig } from './config/database.config';
import { serverConfig } from './config/server.config';
import { validate } from './config/appConfigValidation';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig, databaseConfig, serverConfig],
      validate,
    }),
    ThrottlerModule.forRoot(),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
  ],
  providers: [UniqueEmailConstraint, UniquePhoneNumberConstraint],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(typeOrmFindOptionsQueryMapperMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
