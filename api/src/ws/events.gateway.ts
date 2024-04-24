import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server?: Server;

  afterInit(server: any) {
    console.log('afterinit');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('connection');
  }
  handleDisconnect(client: any) {
    console.log('disconnect');
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: unknown,
    // @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log(data);
    const event = 'eventsResponse';
    // client.
    return { event, data };
  }
}
