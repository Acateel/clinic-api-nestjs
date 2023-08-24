import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { EnvironmentEnum, TokenLifetimeEnum } from 'src/common/enum';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get(EnvironmentEnum.ACCESS_SECRET),
      signOptions: { expiresIn: TokenLifetimeEnum.ACCESS },
    };
  }
}
