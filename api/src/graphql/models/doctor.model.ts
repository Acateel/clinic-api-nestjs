import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AppointmentModel } from './appointment.model';
import { DoctorAvailableSlotModel } from './doctor-available-slot.model';
import { ReviewModel } from './review.model';
import { UserModel } from './user.model';

@ObjectType()
export class DoctorModel {
  @Field(() => Int)
  id!: number;

  @Field()
  speciality!: string;

  @Field(() => UserModel)
  user?: UserModel;

  @Field(() => Int)
  userId!: number;

  @Field(() => [DoctorAvailableSlotModel], { nullable: true })
  availableSlots!: DoctorAvailableSlotModel[];

  @Field(() => [AppointmentModel], { nullable: true })
  appointments?: AppointmentModel[];

  @Field(() => [ReviewModel])
  reviews?: ReviewModel[];

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
