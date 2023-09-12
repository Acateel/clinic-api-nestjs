import { UserResponseDto } from 'src/user/dto/response/userResponse.dto';

export class AuthResponseDto {
  readonly user!: UserResponseDto;
  readonly accessToken!: string;
  readonly refreshToken!: string;
}
