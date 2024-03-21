import {
  Body,
  Controller,
  Get,
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
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { AddCommentDto } from './dto/add-comment.dto';
import { AddCommentResponseDto } from './response-dto/add-comment-response.dto';
import { ReviewService } from './review.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  // TODO: response dto
  // @ApiResponse({ status: HttpStatus.OK, type: [ReviewEntity] })
  get() {
    return this.reviewService.get();
  }

  @Get(':id')
  getById(@Param('id') id: number, @Query('maxDepth') maxDepth: number) {
    return this.reviewService.getById(id, maxDepth);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: AddCommentResponseDto })
  addComment(
    @Param('id') id: number,
    @Body() dto: AddCommentDto,
    @User() user: AccessTokenPayload,
  ) {
    return this.reviewService.addComment(id, dto, user);
  }
}
