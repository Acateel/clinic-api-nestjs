import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './entity/patient.entity';
import { UserEntity } from './entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DoctorEntity } from './entity/doctor.entity';
import { AppointmentEntity } from './entity/appointment.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppConfig } from 'src/common/interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        return {
          type: 'postgres',
          username: configService.get('database.user', {
            infer: true,
          }),
          password: configService.get('database.password', {
            infer: true,
          }),
          host: configService.get('database.host', { infer: true }),
          database: configService.get('database.name', {
            infer: true,
          }),
          port: configService.get('database.port', { infer: true }),
          synchronize: true,
          entities: ['src/database/entity/**/*.ts'],
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
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
export class TestDatabaseModule {}
