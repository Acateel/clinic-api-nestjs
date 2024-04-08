import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { NEVER, Observable, catchError, concatMap, throwError } from 'rxjs';
import { AuthenticatedRequest } from 'src/common/interface';
import { SseService } from '../sse.service';

@Injectable()
export class SseConnectionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SseConnectionInterceptor.name);

  constructor(private readonly sseService: SseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest<AuthenticatedRequest>();
    const res = http.getResponse<Response>();

    if (!req.user) {
      this.logger.error(
        'Can not open connection on unauthorized request. Use auth guard before this interceptor',
      );
      throw new UnauthorizedException();
    }

    const subject = await this.sseService.connect(req, res);
    const observable = next.handle().pipe(
      catchError((err) => {
        subject.error(err);
        return throwError(() => err);
      }),
      concatMap(() => NEVER),
    );

    return observable;
  }
}
