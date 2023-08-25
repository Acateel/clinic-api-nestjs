import { UserDetailsResponseDto } from 'src/user/dto/response/userDetailsResponse.dto';

export class PatientDetailsResponseDto {
  readonly id!: number;
  readonly phoneNumber!: string;
  readonly user!: UserDetailsResponseDto;
  readonly userId!: number;
  readonly createdAt!: Date;
}
