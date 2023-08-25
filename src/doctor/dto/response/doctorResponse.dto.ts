export class DoctorResponseDto {
  readonly id!: number;
  readonly speciality!: string;
  readonly availableSlots!: Date[];
  readonly userId!: number;
}
