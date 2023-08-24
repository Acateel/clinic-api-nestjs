import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentEnum } from 'src/common/enum';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly entitiesPath = 'dist/database/entity/**/*.entity.js';

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.configService.get(EnvironmentEnum.DB_USER),
      password: this.configService.get(EnvironmentEnum.DB_PASSWORD),
      host: this.configService.get(EnvironmentEnum.DB_HOST),
      database: this.configService.get(EnvironmentEnum.DB_NAME),
      port: this.configService.get(EnvironmentEnum.DB_PORT),
      entities: [this.entitiesPath],
      synchronize: true,
    };
  }
}
