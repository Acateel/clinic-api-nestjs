import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SseModule } from 'src/sse/sse.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [DatabaseModule, SseModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
