import { UserResponseDto } from 'src/user/dto/response/userResponse.dto';

export class DoctorDetailsResponseDto {
  readonly id!: string;
  readonly speciality!: string;
  readonly availableSlots!: Date[];
  readonly user!: UserResponseDto;
  readonly userId!: string;
  readonly createdAt!: Date;
}
