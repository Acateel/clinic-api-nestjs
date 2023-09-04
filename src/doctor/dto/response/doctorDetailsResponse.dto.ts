import { UserResponseDto } from 'src/user/dto/response/userResponse.dto';
import { DoctorAvailableSlotDto } from '../doctorAvailableSlot.dto';

export class DoctorDetailsResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: DoctorAvailableSlotDto[];
  readonly user!: UserResponseDto;
  readonly userId!: number;
  readonly createdAt!: Date;
}
