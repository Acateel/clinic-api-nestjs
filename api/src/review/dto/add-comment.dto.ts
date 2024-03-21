import { IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  readonly text!: string;
}
