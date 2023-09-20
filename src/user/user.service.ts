import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    const userWithSameEmail = await this.userRepository.findOneBy({ email });

    if (userWithSameEmail) {
      throw new BadRequestException('Email adress is allready in use');
    }

    const userDetails = await this.userRepository.save({
      ...dto,
      email,
      password: bcrypt.hashSync(dto.password, SALT_ROUNDS),
    });
    const user = await this.userRepository.findOneBy({ id: userDetails.id });

    return user!;
  }

  async get() {
    return this.userRepository.find();
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
      .leftJoinAndSelect('u.patients', 'up')
      .leftJoinAndSelect('u.doctors', 'ud')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email) {
      dto = {
        ...dto,
        email: dto.email.toLowerCase(),
      };
      const userWithSameEmail = await this.userRepository.findOneBy({
        email: dto.email,
      });

      if (userWithSameEmail) {
        throw new BadRequestException('Email adress is allready in use');
      }
    }

    if (dto.password) {
      dto = {
        ...dto,
        password: bcrypt.hashSync(dto.password, SALT_ROUNDS),
      };
    }

    this.userRepository.merge(user, dto);
    const createdUser = await this.userRepository.save(user);

    return this.userRepository.findOneBy({ id: createdUser.id });
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}
