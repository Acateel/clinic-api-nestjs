import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Response } from 'express';
import { Subject } from 'rxjs';
import { AuthenticatedRequest } from 'src/common/interface';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);

  // TODO: support for multiple connections per user
  private connections = new Map<
    number,
    { close: () => void; subject: Subject<MessageEvent> }
  >();

  async connect(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Subject<MessageEvent>> {
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
        res.end();
      },
      error: (err) => {
        this.logger.debug(`observer.error: ${err}`);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify(err)}\n\n`);
      },
    };
    subject.subscribe(observer);

    const connectionKey = req.user.id;
    this.connections.set(connectionKey, {
      close: () => {
        if (!res.closed) {
          res.end();
        }
      },
      subject,
    });

    req.on('close', () => {
      this.logger.debug(`Closing connection for client ${connectionKey}`);
      subject.complete();
      this.connections.delete(connectionKey);

      if (!res.closed) {
        res.end();
      }
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
