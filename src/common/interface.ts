import { FindManyOptions } from 'typeorm';
import { UserRoleEnum } from './enum';
import { Request } from 'express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type FindOptions<T> = Pick<
  FindManyOptions<T>,
  'where' | 'order' | 'take' | 'skip'
>;

export interface ReadOptions<T> {
  find: FindOptions<T>;
}

export interface AuthenticatedRequest extends Request {
  readonly user: UserPayload;
}

export interface UserPayload {
  readonly id: number;
  readonly email: string;
  readonly role: UserRoleEnum;
}

export interface UserOwnedEntity {
  readonly userId: number;
}

export interface AppConfig {
  port: string;
  apiUrl: string;
  jwt: {
    accessSecret: string;
    accessLifetime: string;
    refreshSecret: string;
    refreshLifetime: string;
  };
  database: TypeOrmModuleOptions;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface AppointmentTime {
  startDate: Date;
  endDate: Date;
}

export interface InviteUserPayload {
  email: string;
  role: UserRoleEnum;
}
