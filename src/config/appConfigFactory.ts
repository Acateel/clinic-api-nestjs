import { ConfigFactory } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appConfigFactory: ConfigFactory = () => ({
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  database: {
    type: 'postgres',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    name:
      process.env.NODE_ENV === 'test'
        ? process.env.PGDATABASE + '-test'
        : process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    entities:
      process.env.NODE_ENV === 'test'
        ? ['src/database/entity/**/*.ts']
        : ['dist/database/entity/**/*{.ts,.js}'],
    migrations: ['dist/database/migration/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
  },
});
