import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AuthenticatedRequest, UserOwnedEntity } from '../interface';
import { Reflector } from '@nestjs/core';
import { MetadataEnum, RoleEnum } from '../enum';

@Injectable()
export class RestrictResponseEntityToOwnUserInterceptor
  implements NestInterceptor<UserOwnedEntity>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<UserOwnedEntity>,
  ): Observable<UserOwnedEntity> | Promise<Observable<UserOwnedEntity>> {
    return next.handle().pipe(
      map((patient: UserOwnedEntity) => {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const ownRole = this.reflector.get<RoleEnum>(
          MetadataEnum.OWN_ROLE,
          context.getHandler(),
        );

        if (ownRole && ownRole === req.user.role) {
          if (patient.userId !== req.user.sub) {
            throw new ForbiddenException('Access to other user data denied');
          }
        }

        return patient;
      }),
    );
  }
}
