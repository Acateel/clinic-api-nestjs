import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Auth } from './types';

@Injectable()
export class GrpcTestService implements OnModuleInit {
  private testServ!: Auth;

  constructor(@Inject('TEST') private readonly client: ClientGrpc) {}

  async onModuleInit() {
    try {
      this.testServ = this.client.getService<Auth>('Auth');
      const res = await firstValueFrom(
        this.testServ.login({
          email: 'hello@gmail.com',
          password: 'pass',
          app_id: 1,
        }),
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}
