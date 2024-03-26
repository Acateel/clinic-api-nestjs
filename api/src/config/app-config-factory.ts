import * as path from 'path';
import { AppConfig } from 'src/common/interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appConfigFactory = (): AppConfig => ({
  port: process.env.PORT!,
  apiUrl: process.env.API_URL!,
  jwt: {
    accessSecret: process.env.ACCESS_SECRET!,
    accessLifetime: process.env.ACCESS_LIFETIME!,
    refreshSecret: process.env.REFRESH_SECRET!,
    refreshLifetime: process.env.REFRESH_LIFETIME!,
    inviteSecret: process.env.INVITE_SECRET!,
    inviteLifetime: process.env.INVITE_LIFETIME!,
    resetSecret: process.env.RESET_SECRET!,
    resetLifetime: process.env.RESET_LIFETIME!,
  },
  database: {
    type: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    entities: [process.env.ENTITIES!],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: process.env.SYNCHRONIZE === 'true',
    logging: true,
  },
  smtp: {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    templatesPath: path.resolve('email-template'),
  },
});
