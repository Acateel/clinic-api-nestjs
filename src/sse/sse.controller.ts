import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/common/enum';
import { SseConnectionInterceptor } from 'src/sse/interceptor/sse-connection.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sse')
@Controller('sse')
export class SseController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @UseInterceptors(SseConnectionInterceptor)
  async getSse() {}
}
