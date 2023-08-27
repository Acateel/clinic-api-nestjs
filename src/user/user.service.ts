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
    // TODO: save dto directly?
    const createdUser = await this.userRepository.save(dto);

    return this.userRepository.findOneBy({ id: createdUser.id });
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
      .addSelect(['u.password', 'u.createdAt', 'u.resetToken'])
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
}
