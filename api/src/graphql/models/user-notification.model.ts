import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserNotificationTypeEnum } from 'src/common/enum';

@ObjectType()
export class UserNotificationModel {
  @Field(() => Int)
  id!: number;

  @Field()
  type!: UserNotificationTypeEnum;

  @Field()
  text!: string;

  @Field()
  isSeen!: boolean;
}
