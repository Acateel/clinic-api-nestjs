import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';
import { AppointmentEntity } from './entity/appointment.entity';
import { AppConfig } from 'src/common/interface';
import { DoctorAvailableSlotEntity } from './entity/doctorAvailableSlot.entity';

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
