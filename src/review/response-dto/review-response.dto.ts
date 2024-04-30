export class ReviewResponseDto {
  readonly id!: number;
  readonly rating!: number;
  readonly text!: string | null;
  readonly userId!: number;
  readonly doctorId!: number | null;
}
