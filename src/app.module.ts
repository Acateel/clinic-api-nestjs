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
  ],
  providers: [
    UniqueEmailConstraint,
    { provide: ProviderEnum.APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TypeOrmFindOptionsQueryMapperMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
