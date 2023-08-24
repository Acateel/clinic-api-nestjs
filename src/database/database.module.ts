import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { TypeOrmConfigService } from 'src/database/databaseConfig.service';
import { ConfigModule } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';
import { AppointmentEntity } from './entity/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
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
