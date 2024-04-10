import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [DatabaseModule, DoctorModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
