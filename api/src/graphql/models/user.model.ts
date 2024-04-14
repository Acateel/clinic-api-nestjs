import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/common/enum';
import { CommentModel } from './comment.model';
import { DoctorModel } from './doctor.model';
import { PatientModel } from './patient.model';
import { ReviewModel } from './review.model';
import { UserNotificationModel } from './user-notification.model';

@ObjectType()
export class UserModel {
  @Field(() => Int)
  id!: number;

  @Field()
  email!: string;

  @Field()
  role!: UserRoleEnum;

  @Field()
  fullName!: string;

  @Field(() => String, { nullable: true })
  avatar!: string | null;

  @Field(() => String, { nullable: true })
  resetToken?: string | null;

  @Field(() => String, { nullable: true })
  refreshToken?: string | null;

  @Field(() => [PatientModel], { nullable: true })
  patients?: PatientModel[];

  @Field(() => [DoctorModel], { nullable: true })
  doctors?: DoctorModel[];

  @Field(() => [ReviewModel], { nullable: true })
  reviews?: ReviewModel[];

  @Field(() => [CommentModel], { nullable: true })
  comments?: CommentModel[];

  @Field(() => [UserNotificationModel], { nullable: true })
  notifications?: UserNotificationModel[];

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
