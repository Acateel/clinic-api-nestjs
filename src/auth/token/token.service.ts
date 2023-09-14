import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig, UserPayload } from 'src/common/interface';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createAccessToken(userId: number) {
    const user = await this.userService.getById(userId);
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  async createRefreshToken(userId: number) {
    const user = await this.userService.getById(userId);
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret', { infer: true }),
    });
    await this.userService.setRefreshToken(
      user.email,
      bcrypt.hashSync(refreshToken, SALT_ROUNDS),
    );

    return refreshToken;
  }

  async decodeRefreshToken(token: string) {
    const decoded: UserPayload = this.jwtService.verify(token, {
      secret: this.configService.get('jwt.refreshSecret', { infer: true }),
    });
    const user = await this.userService.getById(decoded.id);

    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidToken = bcrypt.compareSync(token, user.refreshToken);

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return decoded;
  }
}
