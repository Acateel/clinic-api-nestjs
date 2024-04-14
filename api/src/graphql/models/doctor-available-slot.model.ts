import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DoctorModel } from './doctor.model';

@ObjectType()
export class DoctorAvailableSlotModel {
  @Field(() => Int)
  id!: number;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field(() => DoctorModel)
  doctor?: DoctorModel;

  @Field(() => Int)
  doctorId!: number;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
