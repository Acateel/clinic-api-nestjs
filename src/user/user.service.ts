import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from 'src/database/entity/user.entity';
import {
  EntityPropertyNotFoundError,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
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

  async getById(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .addSelect(['u.password', 'u.createdAt', 'u.resetToken'])
      .leftJoinAndSelect('u.patients', 'patients') // TODO: join relations when get entity details?
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.getById(id);
    this.userRepository.merge(user, dto);
    const createdUser = await this.userRepository.save(user);

    return this.userRepository.findOneBy({ id: createdUser.id });
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }

  async find(options: Partial<UserEntity>) {
    const user = await this.userRepository.findOneBy(
      options as FindOptionsWhere<UserEntity>,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
