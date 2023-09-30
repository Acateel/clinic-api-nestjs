import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigurationModule,
    ThrottlerModule.forRoot(),
    UserModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
