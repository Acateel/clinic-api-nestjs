import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { DatabaseOptionsFactory } from 'src/database/databaseOptionsFactory';
import { ConfigModule } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';
import { AppointmentEntity } from './entity/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseOptionsFactory,
      imports: [ConfigModule],
    }),
    TypeOrmModule.forFeature([
      PatientEntity,
      UserEntity,
      DoctorEntity,
      AppointmentEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
