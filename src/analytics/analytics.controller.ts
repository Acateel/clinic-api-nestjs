import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ParseDatePipe } from 'src/common/pipe/parse-date.pipe';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-doctors')
  @ApiQuery({
    name: 'doctorIds',
    type: 'number',
    isArray: true,
    required: false,
  })
  getPopularSpecialities(
    @Query('fromDate', ParseDatePipe) fromDate: Date,
    @Query('toDate', ParseDatePipe) toDate: Date,
    @Query('doctorIds') doctorIds?: number[],
  ) {
    return this.analyticsService.getTopDoctorsByPeriodReport({
      fromDate,
      toDate,
      doctorIds,
    });
  }
}
