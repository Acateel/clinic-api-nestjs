import { DoctorAvailableSlotDto } from '../doctor-available-slot.dto';

export class DoctorResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: DoctorAvailableSlotDto[];
  readonly userId!: number;
  readonly appointmentIds!: number[];
}
