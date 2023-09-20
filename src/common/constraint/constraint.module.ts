import { Module } from '@nestjs/common';
import { UniqueEmailConstraint } from './uniqueEmailConstraint';
import { PatientModule } from 'src/patient/patient.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PatientModule, UserModule],
  providers: [UniqueEmailConstraint],
  exports: [UniqueEmailConstraint],
})
export class ConstraintModule {}
