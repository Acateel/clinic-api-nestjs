import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CronService } from './cron.service';

@Module({
  imports: [DatabaseModule],
  providers: [CronService],
  exports: [CronModule],
})
export class CronModule {}
