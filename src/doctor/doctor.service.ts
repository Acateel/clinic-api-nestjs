import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { UserService } from 'src/user/user.service';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { FindOptions } from 'src/common/interface';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateDoctorDto) {
    const user = await this.userService.find({ id: userId });
    const doctor = this.doctorRepository.create({ ...dto, user });
    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async get(options?: FindOptions<DoctorEntity>) {
    // TODO: order by appointments
    try {
      return await this.doctorRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }
    }
  }

  async getById(id: string) {
    const doctor = await this.doctorRepository
      .createQueryBuilder('d')
      .where('d.id = :id', { id })
      .addSelect(['d.createdAt'])
      .leftJoinAndSelect('d.user', 'duser')
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const doctor = await this.getById(id);
    this.doctorRepository.merge(doctor, dto);
    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async delete(id: string) {
    await this.doctorRepository.delete(id);
  }
}
