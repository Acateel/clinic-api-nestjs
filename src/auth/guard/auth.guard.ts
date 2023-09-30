import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { AccessTokenPayload } from 'src/common/interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: AccessTokenPayload = this.jwtService.verify(token);
      req.user = payload;
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException();
      }

      throw error;
    }

    return true;
  }
}
