import { UserPayload } from 'src/common/interface';

export class AuthResponseDto {
  readonly user!: UserPayload;
  readonly accessToken!: string;
  readonly refreshToken!: string;
}
