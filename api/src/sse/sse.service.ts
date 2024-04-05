import {
  Injectable,
  InternalServerErrorException,
  MessageEvent,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  connectedClients = new Map<
    string,
    { close: () => void; subject: Subject<MessageEvent> }
  >();

  async connect(req: Request, res: Response): Promise<Subject<MessageEvent>> {
    const validationFailed = false;

    /* make some validation */

    if (validationFailed)
      throw new InternalServerErrorException({
        message: 'Query failed',
        error: 100,
        status: 500,
      });

    // Create a subject for this client in which we'll push our data
    const subject = new Subject<MessageEvent>();

    // Create an observer that will take the data pushed to the subject and
    // write it to our connection stream in the right format
    const observer = {
      next: (msg: MessageEvent) => {
        // Called when data is pushed to the subject using subject.next()
        // Encode the message as SSE (see https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)

        // Here's an example of what it could look like, assuming msg.data is an object
        // If msg.data is not an object, you should adjust accordingly

        if (msg.type) res.write(`event: ${msg.type}\n`);
        if (msg.id) res.write(`id: ${msg.id}\n`);
        if (msg.retry) res.write(`retry: ${msg.retry}\n`);

        res.write(`data: ${JSON.stringify(msg.data)}\n\n`);
      },
      complete: () => {
        console.log(`observer.complete`);
      },
      error: (err: any) => {
        console.log(`observer.error: ${err}`);
      },
    };

    // Attach the observer to the subject
    subject.subscribe(observer);

    // Add the client to our client list
    // const clientKey = String(Math.random()); // String that identifies your client
    const clientKey = '_'; // String that identifies your client

    this.connectedClients.set(clientKey, {
      close: () => {
        res.end();
      }, // Will allow us to close the connection if needed
      subject, // Subject related to this client
    });

    // Handle connection closed
    req.on('close', () => {
      console.log(`Closing connection for client ${clientKey}`);
      subject.complete(); // End the observable stream
      this.connectedClients.delete(clientKey); // Remove client from the list
      res.end(); // Close connection (unsure if this is really requried, to release the resources)
    });

    // Send headers to establish SSE connection
    res.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    res.flushHeaders();

    return subject;
    // From this point, the connection with the client is established.
    // We can send data using the subject.next(MessageEvent) function.
    // See the sendDataToClient() function below.
  }

  /** Send a SSE message to the specified client */
  send(clientId: string, message: MessageEvent) {
    this.connectedClients.get(clientId)?.subject.next(message);
  }
}
