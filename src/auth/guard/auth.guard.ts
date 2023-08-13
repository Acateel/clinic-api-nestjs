import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserPayload } from 'src/common/interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: UserPayload = this.jwtService.verify(token);
      req.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    
    return true;
  }
}
