import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { GetDoctorAppointmentsOptionsDto } from './dto/get-doctor-appointments-options.dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('doctor-appointments')
  getDoctorAppointmentsHierarchy(
    @Query() query: GetDoctorAppointmentsOptionsDto,
  ) {
    return this.analyticsService.getForDoctorAppointmentsWithDepartmentHierarchy(
      query,
    );
  }
}
