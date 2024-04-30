import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// TODO: test default env path
dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: [process.env.ENTITIES!],
  migrations: [process.env.MIGRATIONS!],
  namingStrategy: new SnakeNamingStrategy(),
});
