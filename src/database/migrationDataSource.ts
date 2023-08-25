import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseOptionsFactory } from './databaseOptionsFactory';
import * as dotenv from 'dotenv';
import { AppConfig } from 'src/common/interface';

const configService = new ConfigService<AppConfig, true>(dotenv.config());
const optionsFactory = new DatabaseOptionsFactory(configService);

export const dataSource = new DataSource(optionsFactory.createTypeOrmOptions());
