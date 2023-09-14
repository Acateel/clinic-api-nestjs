import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/response/authResponse.dto';
import { ResetPasswordResponseDto } from './dto/response/resetPasswordResponse.dto';
import { AppConfig, UserPayload } from 'src/common/interface';
import { UserEntity } from 'src/database/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SALT_ROUNDS } from 'src/common/constant';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.create(dto);
    const payload = this.getPayload(user);

    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.createRefreshToken(user),
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userService.getByEmail(email);
    const isWrongPassword = !bcrypt.compareSync(password, user.password!);

    if (isWrongPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const payload = this.getPayload(user);

    return {
      user: payload,
      accessToken: this.jwtService.sign(password),
      refreshToken: await this.createRefreshToken(user),
    };
  }

  async resetPassword(email: string): Promise<ResetPasswordResponseDto> {
    const user = await this.userService.getByEmail(email);
    const resetToken = this.jwtService.sign(this.getPayload(user));
    await this.userService.update(user.id, { resetToken });
    await this.logout(user.id);

    return { resetToken };
  }

  async recoverPassword(resetToken: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(resetToken);
      await this.userService.update(decoded.id, {
        password: newPassword,
        refreshToken: null,
      });
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    }
  }

  async refresh(token: string): Promise<AuthResponseDto> {
    try {
      const decoded: UserPayload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.refreshSecret', { infer: true }),
      });
      const user = await this.userService.getById(decoded.id);

      if (!user.refreshToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const isValidToken = bcrypt.compareSync(token, user.refreshToken);

      if (!isValidToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const payload = this.getPayload(user);

      return {
        user: payload,
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.createRefreshToken(user),
      };
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    }
  }

  async logout(userId: number) {
    await this.userService.update(userId, { refreshToken: null });
  }

  private getPayload(user: UserEntity): UserPayload {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async createRefreshToken(user: UserEntity) {
    const refreshToken = this.jwtService.sign(this.getPayload(user), {
      secret: this.configService.get('jwt.refreshSecret', { infer: true }),
      expiresIn: this.configService.get('jwt.refreshLifetime', { infer: true }),
    });
    await this.userService.update(user.id, {
      refreshToken: bcrypt.hashSync(refreshToken, SALT_ROUNDS),
    });

    return refreshToken;
  }
}
