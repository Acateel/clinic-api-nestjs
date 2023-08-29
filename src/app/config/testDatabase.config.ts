import { registerAs } from '@nestjs/config';

export const testDatabaseConfig = registerAs('database', () => ({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  name: process.env.PGTEST_DATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
}));
