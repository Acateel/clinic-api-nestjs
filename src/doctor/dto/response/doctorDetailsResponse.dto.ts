import { UserResponseDto } from 'src/user/dto/response/userResponse.dto';

export class DoctorDetailsResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: Date[];
  readonly user!: UserResponseDto;
  readonly userId!: number;
  readonly createdAt!: Date;
}
