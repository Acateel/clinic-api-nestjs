import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeOrmConfig.service';
import { UniqueEmailConstraint } from './common/util/uniqueEmailConstraint';
import { typeOrmFindOptionsQueryMapperMiddleware } from './common/middleware/TypeOrmFindOptionsQueryMapper.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwtConfig.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { UniquePhoneNumberConstraint } from './common/util/uniquePhoneNumberConstraint';
import { RestrictResponseEntityToOwnUserInterceptor } from './common/interceptor/RestrictResponseEntityToOwnUser.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
      imports: [ConfigModule],
    }),
    UserModule,
    AuthModule,
    PatientModule,
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
