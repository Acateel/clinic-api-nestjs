import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AuthenticatedRequest, UserOwnedEntity } from '../interface';
import { RoleEnum } from '../enum';

export class CheckResponseEntityOwnershipByAuthorizedUserInterceptor
  implements NestInterceptor<UserOwnedEntity>
{
  constructor(private readonly roleToCheck: RoleEnum) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<UserOwnedEntity>,
  ): Observable<UserOwnedEntity> | Promise<Observable<UserOwnedEntity>> {
    return next.handle().pipe(
      map((response: UserOwnedEntity) => {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (this.roleToCheck === req.user.role) {
          if (response.userId !== req.user.id) {
            throw new ForbiddenException('Access to other user data denied');
          }
        }

        return response;
      }),
    );
  }
}
