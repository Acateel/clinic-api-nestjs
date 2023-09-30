import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/common/interface';
import { AppointmentEntity } from './entity/appointment.entity';
import { DoctorAvailableSlotEntity } from './entity/doctor-available-slot.entity';
import { DoctorEntity } from './entity/doctor.entity';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('database'),
    }),
    TypeOrmModule.forFeature([
      PatientEntity,
      UserEntity,
      DoctorEntity,
      AppointmentEntity,
      DoctorAvailableSlotEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
