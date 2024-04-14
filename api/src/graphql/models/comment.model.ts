import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String, { nullable: true })
  text!: string | null;

  @Field(() => Int)
  upVotes!: number;

  @Field(() => Int)
  downVotes!: number;

  @Field(() => [CommentModel], { nullable: true })
  childComments?: CommentModel[];
}
