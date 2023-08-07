import { FindManyOptions } from 'typeorm';
import { UserRoleEnum } from './enum';

export interface ReadOptions<T> {
  find?: FindManyOptions<T>;
}

export interface AuthenticatedRequest {
  user: UserPayload;
}

export interface UserPayload {
  sub: string;
  email: string;
  role: UserRoleEnum;
}
