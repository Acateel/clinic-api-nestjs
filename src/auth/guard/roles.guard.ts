import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MetadataEnum, RoleEnum } from 'src/common/enum';
import { AuthenticatedRequest } from 'src/common/interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      MetadataEnum.ROLES,
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
