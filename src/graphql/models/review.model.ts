import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommentModel } from './comment.model';

@ObjectType()
export class ReviewModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  rating!: number;

  @Field(() => String, { nullable: true })
  text!: string | null;

  @Field(() => [CommentModel], { nullable: true })
  comments?: CommentModel[];
}
