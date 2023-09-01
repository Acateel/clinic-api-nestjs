import { FindManyOptions } from 'typeorm';
import { RoleEnum } from './enum';
import { Request } from 'express';

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
  readonly sub: number;
  readonly email: string;
  readonly role: RoleEnum;
}

export interface UserOwnedEntity {
  readonly userId: number;
}

export interface AppConfig {
  port: number;
  secret: string;
  database: {
    user: string;
    password: string;
    name: string;
    host: number;
    port: number;
  };
}
