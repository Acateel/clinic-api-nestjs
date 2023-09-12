import { Module } from '@nestjs/common';
import { UniqueEmailConstraint } from './uniqueEmailConstraint';
import { UniquePhoneConstraint } from './uniquePhoneConstraint';
import { PatientModule } from 'src/patient/patient.module';
import { UserModule } from 'src/user/user.module';

// REVIEW:
@Module({
  imports: [PatientModule, UserModule],
  providers: [UniqueEmailConstraint, UniquePhoneConstraint],
  exports: [UniqueEmailConstraint, UniquePhoneConstraint],
})
export class ConstraintModule {}
