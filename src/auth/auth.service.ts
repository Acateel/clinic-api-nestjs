import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/common/interface';
import * as uuid from 'uuid';
import { SALT_ROUNDS } from 'src/common/constant';

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

    // TODO: create respose dto?
    return { user: payload, access_token: this.jwtService.sign(payload) };
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.find({ email });
      const userDetails = await this.userService.readById(user.id);

      if (!bcrypt.compareSync(password, userDetails.password!)) {
        throw new Error('Incorrect password');
      }

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return { user: payload, access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }

  async resetPassword(email: string) {
    const resetToken = uuid.v4();
    const user = await this.userService.find({ email });
    await this.userService.update(user.id, { resetToken });
    return resetToken;
  }

  async recoverPassword(resetToken: string, newPassword: string) {
    const user = await this.userService.find({ resetToken });
    await this.userService.update(user.id, {
      password: bcrypt.hashSync(newPassword, SALT_ROUNDS),
      resetToken: null,
    });
  }
}
