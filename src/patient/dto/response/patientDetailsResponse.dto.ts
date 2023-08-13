import { UserDetailsResponseDto } from 'src/user/dto/response/userDetailsResponse.dto';

export class PatientDetailsResponseDto {
  readonly id!: string;
  readonly phoneNumber!: string;
  readonly user!: UserDetailsResponseDto;
  readonly userId!: string;
  readonly createdAt!: Date;
}
