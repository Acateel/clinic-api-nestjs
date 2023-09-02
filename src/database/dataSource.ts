import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  username: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  entities: ['dist/database/entity/*{.ts,.js}'],
  migrations: ['src/database/migration/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
});
