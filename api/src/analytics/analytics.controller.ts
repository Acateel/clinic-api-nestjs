import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { GetDoctorAppointmentsQueryDto } from './dto/get-doctor-appointments-query.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('doctor-appointments-summary')
  getDoctorAppointmentsSummary(@Query() query: GetDoctorAppointmentsQueryDto) {
    return this.analyticsService.getDoctorAppointmentsSummary(query);
  }
}
