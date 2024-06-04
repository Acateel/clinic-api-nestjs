export class CreateDepartmentResponseDto {
  readonly id!: number;
  readonly name!: string;
  readonly parentDepartmentId!: number | null;
}
