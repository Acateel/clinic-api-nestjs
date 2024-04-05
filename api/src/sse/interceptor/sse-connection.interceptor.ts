import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { NEVER, Observable, of } from 'rxjs';
import { AuthenticatedRequest } from 'src/common/interface';
import { SseService } from '../sse.service';

@Injectable()
export class SseConnectionInterceptor implements NestInterceptor {
  // TODO: inject in constructor
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
      this.logger.error('Can not open connection on unauthorized request');
      return of(null);
    }

    const subscription = next.handle().subscribe();

    const subject = await this.sseService.connect(req, res);
    subject.subscribe({
      complete: () => {
        res.end();
        subscription.unsubscribe();
      },
    });

    return NEVER;
  }
}
