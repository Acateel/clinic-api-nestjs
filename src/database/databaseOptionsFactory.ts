import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfig } from 'src/common/interface';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class DatabaseOptionsFactory implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  createTypeOrmOptions(): DataSourceOptions {
    return {
      type: 'postgres',
      username: this.configService.get('database.user', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      synchronize: true,
      entities: ['dist/database/entity/**/*{.ts,.js}'],
      migrations: ['dist/database/migration/*{.ts,.js}'],
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
