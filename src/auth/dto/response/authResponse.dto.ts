import { UserPayloadDto } from '../userPayload.dto';

export class AuthResponseDto {
  readonly user!: UserPayloadDto;
  readonly access_token!: string;
}
