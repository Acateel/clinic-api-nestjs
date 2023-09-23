import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({ path: '.env.develop' });

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
