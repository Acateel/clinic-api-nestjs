import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';
import { UserEntity } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect([
        'user.password',
        'user.createdAt',
        'user.resetToken',
        'user.refreshToken',
      ])
      .leftJoinAndSelect('user.patients', 'patient')
      .leftJoinAndSelect('user.doctors', 'doctor')
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

    user.fullName = dto.fullName ?? user.fullName;
    user.role = dto.role ?? user.role;

    if (dto.email) {
      user.email = dto.email.toLowerCase();

      const userWithSameEmail = await this.userRepository.findOneBy({
        email: user.email,
      });

      if (userWithSameEmail) {
        throw new BadRequestException('Email adress is allready in use');
      }
    }

    if (dto.password) {
      user.password = bcrypt.hashSync(dto.password, SALT_ROUNDS);
    }

    // TODO: в таблице пользователя нет patientIds, doctorIds
    // поэтому update при обновлении с ними ругается.
    // удалить эти поля из сущности или удалять их здесь с ключ словом delete?
    // удалять с delete не удобно если поле requered как у меня в сущности.
    const { patientIds, doctorIds, ...updateData } = user;

    await this.userRepository.update(user.id, updateData);

    return this.userRepository.findOneBy({ id: user.id });
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }
}
