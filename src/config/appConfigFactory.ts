import { ConfigFactory } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appConfigFactory: ConfigFactory = () => ({
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  database: {
    type: 'postgres',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    name: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    entities: [process.env.PGENTITIES],
    migrations: [process.env.PGMIGRATIONS],
    migrationsRun: process.env.PGMIGRATIONS_RUN === 'true' ? true : false,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: process.env.SYNCHRONIZE === 'true' ? true : false,
  },
});
