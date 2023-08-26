import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/common/interface';
import * as uuid from 'uuid';
import { AuthResponseDto } from './dto/response/authResponse.dto';
import { ResetPasswordResponseDto } from './dto/response/resetPasswordResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = await this.userService.create(dto);
    const payload: UserPayload = {
      sub: user!.id,
      email: user!.email,
      role: user!.role,
    };
    const response: AuthResponseDto = {
      user: payload,
      access_token: this.jwtService.sign(payload),
    };

    return response;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      const userDetails = await this.userService.getById(user.id);

      const isWrongPassword = !bcrypt.compareSync(
        password,
        userDetails.password!,
      );
      if (isWrongPassword) {
        throw new UnauthorizedException('Wrong credentials');
      }

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const response: AuthResponseDto = {
        user: payload,
        access_token: this.jwtService.sign(payload),
      };

      return response;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }

  async resetPassword(email: string) {
    const resetToken = uuid.v4();
    const user = await this.userService.getByEmail(email);
    await this.userService.update(user.id, { resetToken });
    const response: ResetPasswordResponseDto = {
      resetToken,
    };

    return response;
  }

  async recoverPassword(resetToken: string, newPassword: string) {
    const user = await this.userService.getByResetToken(resetToken);
    await this.userService.update(user.id, {
      password: newPassword,
      resetToken: null,
    });
  }
}
