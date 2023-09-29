import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ParseDatePipe } from 'src/common/pipe/parseDate.pipe';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('popular-specialities')
  getPopularSpecialities() {
    return this.analyticsService.getPopularSpecialities();
  }

  @Get('popular-doctors')
  getPopularDoctors(
    @Query('fromDate', ParseDatePipe) fromDate?: Date,
    @Query('toDate', ParseDatePipe) toDate?: Date,
  ) {
    return this.analyticsService.getPopularDoctorsInTimeframe({
      fromDate,
      toDate,
    });
  }
}
