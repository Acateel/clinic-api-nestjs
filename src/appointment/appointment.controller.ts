import { Controller, HttpStatus, Post, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentResponseDto } from './dto/response/appointmentResponse.dto';
import { CreateAppointmentDto } from './dto/createAppointment.dto';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: AppointmentResponseDto })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }
}
