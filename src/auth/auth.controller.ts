import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { User } from 'src/common/decorator/user.decorator';
import { AccessTokenPayload } from 'src/common/interface';
import { AuthService } from './auth.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { ResetPasswordResponseDto } from './dto/response/reset-password-response.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({ status: HttpStatus.OK, type: ResetPasswordResponseDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
  logout(@User() user: AccessTokenPayload) {
    return this.authService.logout(user);
  }

  @Post('recover/:resetToken')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  recoverPassword(
    @Param('resetToken') resetToken: string,
    @Body() dto: RecoverPasswordDto,
  ) {
    return this.authService.recoverPassword(resetToken, dto.password);
  }

  @Post('register/:inviteToken')
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 5)
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  registerWithInvite(
    @Param('inviteToken') inviteToken: string,
    @Body() dto: InviteUserDto,
  ) {
    return this.authService.registerWithInvite(inviteToken, dto);
  }
}
