import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { SALT_ROUNDS } from 'src/common/constant';
import { UserRoleEnum } from 'src/common/enum';
import {
  AccessTokenPayload,
  AppConfig,
  InviteTokenPayload,
  RefreshTokenPayload,
  ResetTokenPayload,
} from 'src/common/interface';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { InviteUserDto } from './dto/invite-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { ResetPasswordResponseDto } from './dto/response/reset-password-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.create(dto);

    return {
      accessToken: this.jwtService.sign(this.getAccessTokenPayload(user)),
      refreshToken: await this.createAndSetRefreshTokenToUser(user),
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const isWrongPassword = !bcrypt.compareSync(password, user.password!);

    if (isWrongPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return {
      accessToken: this.jwtService.sign(this.getAccessTokenPayload(user)),
      refreshToken: await this.createAndSetRefreshTokenToUser(user),
    };
  }

  async resetPassword(email: string): Promise<ResetPasswordResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('jwt.resetSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.resetLifetime', { infer: true }),
      },
    );
    user.resetToken = resetToken;

    const { patientIds, doctorIds, ...updateData } = user;

    await this.userRepository.update(user.id, updateData);
    await this.logout(user);

    return { resetToken };
  }

  async recoverPassword(resetToken: string, newPassword: string) {
    try {
      const payload: ResetTokenPayload = this.jwtService.verify(resetToken, {
        secret: this.configService.get('jwt.resetSecret', { infer: true }),
      });
      const user = await this.userRepository.findOneBy({ id: payload.id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = newPassword;
      user.refreshToken = null;

      const { patientIds, doctorIds, ...updateData } = user;

      await this.userRepository.update(user.id, updateData);
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
      const payload: RefreshTokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.refreshSecret', { infer: true }),
      });
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: payload.id })
        .addSelect(['user.refreshToken'])
        .getOne();

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const isValidToken = bcrypt.compareSync(token, user.refreshToken);

      if (!isValidToken) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        accessToken: this.jwtService.sign(this.getAccessTokenPayload(user)),
        refreshToken: await this.createAndSetRefreshTokenToUser(user),
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

  async logout(payload: AccessTokenPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refreshToken = null;

    const { patientIds, doctorIds, ...updateData } = user;

    await this.userRepository.update(user.id, updateData);
  }

  async registerWithInvite(
    inviteToken: string,
    dto: InviteUserDto,
  ): Promise<AuthResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const payload: InviteTokenPayload = this.jwtService.verify(inviteToken, {
        secret: this.configService.get('jwt.inviteSecret', { infer: true }),
      });

      if (payload.role === UserRoleEnum.DOCTOR) {
        const userRepository = queryRunner.manager.getRepository(UserEntity);

        const userWithSameEmail = await userRepository.findOneBy({
          email: payload.email,
        });

        if (userWithSameEmail) {
          throw new BadRequestException('Email adress is allready in use');
        }

        const user = await userRepository.save({
          email: payload.email,
          password: bcrypt.hashSync(dto.password, SALT_ROUNDS),
          fullName: 'Change',
          role: UserRoleEnum.DOCTOR,
        });

        const doctorRepository =
          queryRunner.manager.getRepository(DoctorEntity);
        await doctorRepository.insert({ user, speciality: 'Change' });

        await queryRunner.commitTransaction();

        return {
          accessToken: this.jwtService.sign(this.getAccessTokenPayload(user)),
          refreshToken: await this.createAndSetRefreshTokenToUser(user),
        };
      }

      throw new UnauthorizedException('Invalid user role');
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid token');
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getAccessTokenPayload(user: UserEntity): AccessTokenPayload {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async createAndSetRefreshTokenToUser(user: UserEntity) {
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get('jwt.refreshSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.refreshLifetime', {
          infer: true,
        }),
      },
    );

    user.refreshToken = bcrypt.hashSync(refreshToken, SALT_ROUNDS);

    // TODO: make relations ids column
    const { patientIds, doctorIds, ...updateData } = user;

    await this.userRepository.update(user.id, updateData);

    return refreshToken;
  }
}
