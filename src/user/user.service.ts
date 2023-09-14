import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from 'src/database/entity/user.entity';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FindOptions } from 'src/common/interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const userDetails = await this.userRepository.save(dto);
    const user = await this.userRepository.findOneBy({ id: userDetails.id });

    if (!user) {
      throw new Error('User was not created');
    }

    return user;
  }

  async get(options?: FindOptions<UserEntity>) {
    try {
      return await this.userRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }
    }
  }

  async getById(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .addSelect([
        'u.password',
        'u.createdAt',
        'u.resetToken',
        'u.refreshToken',
      ])
      .leftJoinAndSelect('u.patients', 'patients')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .addSelect(['u.password'])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByResetToken(resetToken: string) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.resetToken = :resetToken', { resetToken })
      .addSelect(['u.resetToken'])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.getById(id);
    this.userRepository.merge(user, dto);
    const createdUser = await this.userRepository.save(user);

    return this.userRepository.findOneBy({ id: createdUser.id });
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }

  // REVIEW:
  async setRefreshToken(email: string, token: string | null) {
    const user = await this.getByEmail(email);
    user.refreshToken = token;
    await this.userRepository.save(user);
  }
}
