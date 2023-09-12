import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { AuthResponseDto } from './dto/response/authResponse.dto';
import { ResetPasswordResponseDto } from './dto/response/resetPasswordResponse.dto';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.create(dto);

    return {
      user: user!,
      accessToken: await this.tokenService.createAccessToken(user!.id),
      refreshToken: await this.tokenService.createRefreshToken(user!.id),
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.getByEmail(email);
      const isWrongPassword = !bcrypt.compareSync(password, user.password!);

      if (isWrongPassword) {
        throw new UnauthorizedException('Wrong credentials');
      }

      return {
        user: user!,
        accessToken: await this.tokenService.createAccessToken(user!.id),
        refreshToken: await this.tokenService.createRefreshToken(user!.id),
      };
    } catch (error) {
      // TODO:
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException('Wrong credentials');
      }
      throw error;
    }
  }

  async resetPassword(email: string): Promise<ResetPasswordResponseDto> {
    const resetToken = uuid.v4();
    const user = await this.userService.getByEmail(email);
    await this.userService.update(user.id, { resetToken });
    // TODO: logout
    return { resetToken };
  }

  async recoverPassword(resetToken: string, newPassword: string) {
    const user = await this.userService.getByResetToken(resetToken);
    await this.userService.update(user.id, {
      password: newPassword,
      resetToken: null,
    });
  }

  async refresh(token: string): Promise<AuthResponseDto> {
    const decoded = this.tokenService.decode(token);
    const user = await this.userService.getById(decoded.id);

    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      user,
      accessToken: await this.tokenService.createAccessToken(user.id),
      refreshToken: await this.tokenService.createRefreshToken(user.id),
    };
  }

  async logout() {
    // todo: delete refresh token
  }
}
