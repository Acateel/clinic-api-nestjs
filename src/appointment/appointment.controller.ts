import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentResponseDto } from './dto/response/appointmentResponse.dto';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { ReadOptions } from 'src/common/interface';
import { AppointmentDetailsResponseDto } from './dto/response/appointmentDetailsResponse.dto';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';

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
  get(@Query() query: ReadOptions<AppointmentEntity>) {
    return this.appointmentService.get(query.find);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: AppointmentDetailsResponseDto })
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
