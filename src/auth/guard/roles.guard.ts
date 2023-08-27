import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleEnum } from 'src/common/enum';
import { AuthenticatedRequest } from 'src/common/interface';

export class RolesGuard implements CanActivate {
  private readonly requiredRoles?: RoleEnum[];

  constructor(...requiredRoles: RoleEnum[]) {
    this.requiredRoles = requiredRoles;
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.requiredRoles) {
      return true;
    }

    const req: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.requiredRoles.includes(req.user.role);
  }
}
