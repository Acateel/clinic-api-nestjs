import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AppointmentModel } from './appointment.model';
import { UserModel } from './user.model';

@ObjectType()
export class PatientModel {
  @Field(() => Int)
  id!: number;

  @Field()
  phoneNumber!: string;

  @Field(() => UserModel, { nullable: true })
  user!: UserModel;

  @Field(() => Int)
  userId!: number;

  @Field(() => [AppointmentModel], { nullable: true })
  appointments?: AppointmentModel[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
