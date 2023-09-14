import { Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Catch(TokenExpiredError, JsonWebTokenError)
export class TokenExceptionFilter implements ExceptionFilter {
  catch() {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
