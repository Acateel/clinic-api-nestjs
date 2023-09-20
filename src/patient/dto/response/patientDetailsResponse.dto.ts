import { AppointmentResponseDto } from 'src/appointment/dto/response/appointmentResponse.dto';
import { UserDetailsResponseDto } from 'src/user/dto/response/userDetailsResponse.dto';

export class PatientDetailsResponseDto {
  readonly id!: number;
  readonly phoneNumber!: string;
  readonly user!: UserDetailsResponseDto;
  readonly userId!: number;
  readonly appointments!: AppointmentResponseDto[];
  readonly appointmentIds!: number[];
  readonly createdAt!: Date;
}
