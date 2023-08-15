import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";
import { IsFutureDate } from "src/common/decorator/isFutureDate.decorator";

export class CreateDoctorDto {
    @IsNotEmpty()
	readonly speciality!: string;

	@IsOptional()
	@IsDateString({}, { each: true })
	@IsFutureDate({ each: true })
	readonly availableSlots?: string[];
}