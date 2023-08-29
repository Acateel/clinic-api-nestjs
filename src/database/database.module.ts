import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';
import { AppointmentEntity } from './entity/appointment.entity';
import { AppConfig } from 'src/common/interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('database'),
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
