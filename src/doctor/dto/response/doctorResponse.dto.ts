export class DoctorResponseDto {
  readonly id!: string;
  readonly speciality!: string;
  readonly availableSlots!: Date[];
  readonly userId!: string;
}
