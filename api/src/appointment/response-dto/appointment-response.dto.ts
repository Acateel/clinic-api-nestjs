export class AppointmentResponseDto {
  readonly id!: number;
  readonly startDate!: Date;
  readonly endDate!: Date;
  readonly patientId!: number;
  readonly doctorId!: number;
}
