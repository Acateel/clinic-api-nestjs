import { AppointmentResponseDto } from 'src/appointment/dto/response/appointment-response.dto';
import { UserResponseDto } from 'src/user/dto/response/user-response.dto';
import { DoctorAvailableSlotDto } from '../doctor-available-slot.dto';

export class DoctorDetailsResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: DoctorAvailableSlotDto[];
  readonly user!: UserResponseDto;
  readonly userId!: number;
  readonly appointments!: AppointmentResponseDto[];
  readonly appointmentIds!: number[];
  readonly createdAt!: Date;
}
