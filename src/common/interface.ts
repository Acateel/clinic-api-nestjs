import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Request } from 'express';
import { UserRoleEnum } from './enum';

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
    resetSecret: string;
    resetLifetime: string;
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

export interface AuthenticatedRequest extends Request {
  readonly user: AccessTokenPayload;
}

export interface InviteTokenPayload {
  email: string;
  role: UserRoleEnum;
}

export interface AccessTokenPayload {
  readonly id: number;
  readonly email: string;
  readonly role: UserRoleEnum;
}

export interface ResetTokenPayload {
  readonly id: number;
}

export interface RefreshTokenPayload {
  readonly id: number;
}

export interface AppointmentTime {
  startDate: Date;
  endDate: Date;
}
