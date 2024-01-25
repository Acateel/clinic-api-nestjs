import { IsNotEmpty } from 'class-validator';

export class InviteUserDto {
  @IsNotEmpty()
  password!: string;
}
