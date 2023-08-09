import { FindManyOptions } from 'typeorm';
import { RoleEnum } from './enum';

export type FindOptions<T> = Pick<
  FindManyOptions<T>,
  'where' | 'order' | 'take' | 'skip'
>;

export interface ReadOptions<T> {
  find: FindOptions<T>;
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
