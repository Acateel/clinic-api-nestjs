import {
  Body,
  Controller,
  Param,
  Post,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RecoverPasswordDto } from './dto/recoverPassword.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/response/authResponse.dto';
import { ResetPasswordResponseDto } from './dto/response/resetPasswordResponse.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: ResetPasswordResponseDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email);
  }

  @Post('recover/:resetToken')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'resetToken',
    description: 'v4',
    example: 'f58e129c-2db7-400c-a5f4-45b19a9afff3',
  })
  recoverPassword(
    @Param('resetToken') resetToken: string,
    @Body() dto: RecoverPasswordDto,
  ) {
    return this.authService.recoverPassword(resetToken, dto.password);
  }

  // TODO: logout
}
