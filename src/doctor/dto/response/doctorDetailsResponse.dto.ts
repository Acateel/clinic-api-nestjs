import { UserResponseDto } from 'src/user/dto/response/userResponse.dto';
import { DoctorAvailableSlotDto } from '../doctorAvailableSlot.dto';
import { AppointmentResponseDto } from 'src/appointment/dto/response/appointmentResponse.dto';

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
