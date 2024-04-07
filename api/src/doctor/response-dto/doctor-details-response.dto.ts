import { AppointmentResponseDto } from 'src/appointment/response-dto/appointment-response.dto';
import { UserResponseDto } from 'src/user/response-dto/user-response.dto';
import { DoctorAvailableSlotDto } from '../../doctor-available-slot/doctor-available-slot.dto';

export class DoctorDetailsResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: DoctorAvailableSlotDto[];
  readonly user!: UserResponseDto;
  readonly userId!: number;
  readonly appointments!: AppointmentResponseDto[];
  readonly appointmentIds!: number[];
  readonly createdAt!: Date;
  readonly rating!: number;
}
