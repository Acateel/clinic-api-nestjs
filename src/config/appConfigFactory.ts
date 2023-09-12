import { AppConfig } from 'src/common/interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appConfigFactory = (): AppConfig => ({
  port: process.env.PORT!,
  jwt: {
    accessSecret: process.env.ACCESS_SECRET!,
    refreshSecret: process.env.REFRESH_SECRET!,
  },
  database: {
    type: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    entities: [process.env.ENTITIES!],
    migrations: [process.env.MIGRATIONS!],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: process.env.SYNCHRONIZE === 'true',
  },
});
