import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  create(@Body() dto: CreateCommentDto, @User() user: AccessTokenPayload) {
    return this.commentService.create(dto, user);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  like(@Param('id') id: number, @User() user: AccessTokenPayload) {
    return this.commentService.like(id, user);
  }

  @Post(':id/dislike')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  dislike(@Param('id') id: number, @User() user: AccessTokenPayload) {
    return this.commentService.dislike(id, user);
  }
}
