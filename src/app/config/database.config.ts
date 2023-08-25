import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  name: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
}));
