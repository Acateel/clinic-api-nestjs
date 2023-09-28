import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { FromDate } from 'src/common/decorator/fromDate.decorator';
import { ToDate } from 'src/common/decorator/toDate.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('popular-specialities')
  getPopularSpecialities() {
    return this.analyticsService.getPopularSpecialities();
  }

  @Get('popular-doctors')
  getPopularDoctors(@FromDate() fromDate?: Date, @ToDate() toDate?: Date) {
    return this.analyticsService.getPopularDoctorsInTimeframe({
      fromDate,
      toDate,
    });
  }
}
