import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentDetailsResponseDto } from './response-dto/appointment-details-response.dto';
import { AppointmentResponseDto } from './response-dto/appointment-response.dto';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: AppointmentResponseDto })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: AppointmentResponseDto })
  get(@Query() query) {
    return this.appointmentService.get(query);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: [AppointmentDetailsResponseDto] })
  getById(@Param('id') id: number) {
    return this.appointmentService.getById(id);
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: AppointmentResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.appointmentService.delete(id);
  }
}
