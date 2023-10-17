import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from 'src/common/pipe/parse-date.pipe';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('doctor-appointments/hierarchy')
  @ApiQuery({
    name: 'doctorIds',
    type: 'number',
    isArray: true,
    required: false,
  })
  getDoctorAppointmentsHierarchy(
    @Query('fromDate', ParseDatePipe) fromDate: Date,
    @Query('toDate', ParseDatePipe) toDate: Date,
    @Query('doctorIds') doctorIds?: number[],
    @Query('isIncludeEmptyValues') isIncludeEmptyValues = false,
  ) {
    return this.analyticsService.getForDoctorAppointmentsWithDepartmentHierarchy(
      fromDate,
      toDate,
      doctorIds!,
      isIncludeEmptyValues,
    );
  }
}
