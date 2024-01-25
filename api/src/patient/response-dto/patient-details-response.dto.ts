import { AppointmentResponseDto } from 'src/appointment/response-dto/appointment-response.dto';
import { UserDetailsResponseDto } from 'src/user/response-dto/user-details-response.dto';

export class PatientDetailsResponseDto {
  readonly id!: number;
  readonly phoneNumber!: string;
  readonly user!: UserDetailsResponseDto;
  readonly userId!: number;
  readonly appointments!: AppointmentResponseDto[];
  readonly appointmentIds!: number[];
  readonly createdAt!: Date;
}
