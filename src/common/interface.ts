import { UserRoleEnum } from './enum';
import { Request } from 'express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// TODO: delete
export interface AuthenticatedRequest extends Request {
  readonly user: UserPayload;
}

export interface UserPayload {
  readonly id: number;
  readonly email: string;
  readonly role: UserRoleEnum;
}

export interface AppConfig {
  port: string;
  apiUrl: string;
  jwt: {
    accessSecret: string;
    accessLifetime: string;
    refreshSecret: string;
    refreshLifetime: string;
    inviteSecret: string;
    inviteLifetime: string;
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

export interface InviteTokenPayload {
  email: string;
  role: UserRoleEnum;
}

// TODO: migrate to AccessTokenPayload interface, decorator for user from request
export interface AccessTokenPayload {
  readonly id: number;
  readonly email: string;
  readonly role: UserRoleEnum;
}
