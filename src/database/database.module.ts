import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { TypeOrmConfigService } from 'src/config/typeOrmConfig.service';
import { ConfigModule } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    TypeOrmModule.forFeature([PatientEntity, UserEntity, DoctorEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
