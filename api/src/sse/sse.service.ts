import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Response } from 'express';
import { Subject } from 'rxjs';
import { AuthenticatedRequest } from 'src/common/interface';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);

  private connections = new Map<
    number,
    { close: () => void; subject: Subject<MessageEvent> }
  >();

  async connect(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Subject<MessageEvent>> {
    // if (validationFailed)
    //   throw new InternalServerErrorException({
    //     message: 'Query failed',
    //     error: 100,
    //     status: 500,
    //   });

    const subject = new Subject<MessageEvent>();
    const observer = {
      next: (msg: MessageEvent) => {
        if (msg.type) {
          res.write(`event: ${msg.type}\n`);
        }

        if (msg.id) {
          res.write(`id: ${msg.id}\n`);
        }

        if (msg.retry) {
          res.write(`retry: ${msg.retry}\n`);
        }

        res.write(`data: ${JSON.stringify(msg.data)}\n\n`);
      },
      complete: () => {
        this.logger.debug('observer.complete');
      },
      error: (err: any) => {
        this.logger.debug(`observer.error: ${err}`);
      },
    };
    subject.subscribe(observer);

    const connectionKey = req.user.id;
    this.connections.set(connectionKey, {
      close: () => {
        res.end();
      },
      subject,
    });

    req.on('close', () => {
      this.logger.debug(`Closing connection for client ${connectionKey}`);
      subject.complete();
      this.connections.delete(connectionKey);
      res.end();
    });

    res.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
    res.flushHeaders();
    this.logger.debug(`Opening connection for client ${connectionKey}`);

    return subject;
  }

  send(connectionKey: number, message: MessageEvent) {
    this.connections.get(connectionKey)?.subject.next(message);
  }
}
