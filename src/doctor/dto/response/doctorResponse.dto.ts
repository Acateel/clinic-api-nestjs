import { DoctorAvailableSlotDto } from '../doctorAvailableSlot.dto';

export class DoctorResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: DoctorAvailableSlotDto[];
  readonly userId!: number;
}
