import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { DoctorModel } from './doctor.model';
import { PatientModel } from './patient.model';

@ObjectType()
export class AppointmentModel {
  @Field(() => Int)
  id!: number;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field(() => PatientModel)
  patient?: PatientModel;

  @Field(() => Int)
  patientId!: number;

  @Field(() => DoctorModel)
  doctor?: DoctorModel;

  @Column()
  doctorId!: number;
}
