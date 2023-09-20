import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigurationModule } from './config/configuration.module';
import { ConstraintModule } from './common/constraint/constraint.module';

@Module({
  imports: [
    ConfigurationModule,
    ThrottlerModule.forRoot(),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    ConstraintModule,
  ],
})
export class AppModule {}
