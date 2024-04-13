import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

// TODO: use ArgsType decorator?
@InputType()
export class GetUserInput {
  @Field()
  @IsNumber()
  readonly id!: number;
}
