import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcTestService } from './grpc-test.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST',
        transport: Transport.GRPC,
        options: {
          loader: {
            keepCase: true,
          },
          package: 'auth',
          protoPath: join(__dirname, 'test.proto'),
          url: '127.0.0.1:44044', // test gRPC golang service
        },
      },
    ]),
  ],
  providers: [GrpcTestService],
})
export class GrpcTestModule {}
