import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [DatabaseModule, SseModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
