import { FindManyOptions } from 'typeorm';
import { RoleEnum } from './enum';

export interface ReadOptions<T> {
  find?: FindManyOptions<T>;
}

export interface AuthenticatedRequest {
  readonly user: UserPayload;
}

export interface UserPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: RoleEnum;
}

export interface UserOwnedEntity {
  readonly userId: string;
}
