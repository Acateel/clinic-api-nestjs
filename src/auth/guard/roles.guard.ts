import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MetadataKeyEnum, UserRoleEnum } from 'src/common/enum';
import { AuthenticatedRequest } from 'src/common/interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      MetadataKeyEnum.ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const req: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException();
    }

    return requiredRoles.includes(req.user.role);
  }
}
