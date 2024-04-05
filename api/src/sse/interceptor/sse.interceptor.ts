import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NEVER, Observable } from 'rxjs';
import { SseService } from '../sse.service';

@Injectable()
export class SseInterceptor implements NestInterceptor {
  constructor(private readonly sseService: SseService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

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
