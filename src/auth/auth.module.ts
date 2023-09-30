import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from 'src/common/interface';
import { DatabaseModule } from 'src/database/database.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    DoctorModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        secret: configService.get('jwt.accessSecret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.accessLifetime', { infer: true }),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
