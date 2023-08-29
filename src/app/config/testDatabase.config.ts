import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const testDatabaseConfig = registerAs('database', () => ({
  type: 'postgres',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  name: process.env.PGTEST_DATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  entities: ['src/database/entity/**/*.ts'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
}));
