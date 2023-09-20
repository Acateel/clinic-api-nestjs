import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
