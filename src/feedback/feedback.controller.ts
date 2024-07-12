import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { User } from 'src/common/decorator/user.decorator';
import { CreateFeedbackResponseDto } from './response-dto/feedback-response.dto';
import { GetFeedbackByDoctorIdResponseDto } from './response-dto/get-feedback-by-doctor-id-response.dto';
import { VoteQueryDto } from './dto/vote-query.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateFeedbackResponseDto })
  addComment(@Body() dto: CreateFeedbackDto, @User() user: AccessTokenPayload) {
    return this.feedbackService.create(user, dto);
  }

  @Get('doctors/:id')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeedbackByDoctorIdResponseDto,
  })
  getByDoctorId(@Param('id') id: number) {
    return this.feedbackService.getByDoctorId(id);
  }

  @Post(':id/vote')
  @UseGuards(ThrottlerGuard)
  @Throttle(1, 5000)
  @HttpCode(HttpStatus.OK)
  vote(@Param('id') id: number, @Query() query: VoteQueryDto) {
    return this.feedbackService.vote(id, query);
  }
}
