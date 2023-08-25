import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtOptionsFactory as NestJwtOptionsFactory,
  JwtModuleOptions,
} from '@nestjs/jwt';
import { TokenLifetimeEnum } from 'src/common/enum';
import { AppConfig } from 'src/common/interface';

@Injectable()
export class JwtOptionsFactory implements NestJwtOptionsFactory {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('jwt.secret', { infer: true }),
      signOptions: { expiresIn: TokenLifetimeEnum.ACCESS },
    };
  }
}
