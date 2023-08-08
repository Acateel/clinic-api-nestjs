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
import { TypeOrmFindOptionsQueryMapperMiddleware } from './common/middleware/TypeOrmFindOptionsQueryMapper.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwtConfig.service';
import { ProviderEnum } from './common/enum';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { UniquePhoneNumberConstraint } from './common/util/uniquePhoneNumberConstraint';
import { RolesGuard } from './auth/roles.guard';
import { RestrictResponseEntityToOwnUserInterceptor } from './common/interceptor/RestrictResponseEntityToOwnUser.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    JwtModule.registerAsync({
      global: true,
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
    { provide: ProviderEnum.AUTH_GUARD, useClass: AuthGuard },
    { provide: ProviderEnum.ROLES_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TypeOrmFindOptionsQueryMapperMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
