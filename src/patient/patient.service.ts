import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { PatientEntity } from '../database/entity/patient.entity';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { FindOptions } from '../common/interface';
import { UserEntity } from 'src/database/entity/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userId: number, dto: CreatePatientDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const patient = this.patientRepository.create({ ...dto, user });
    const createdPatient = await this.patientRepository.save(patient);

    return this.patientRepository.findOneBy({ id: createdPatient.id });
  }

  async get(options?: FindOptions<PatientEntity>) {
    try {
      return await this.patientRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }

      throw error;
    }
  }

  async getById(id: number) {
    const patient = await this.patientRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .addSelect(['p.createdAt'])
      .leftJoinAndSelect('p.user', 'puser')
      .getOne();

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  // TODO: example
  async getByIdRestrictedToUserOwnership(userId: number, patientId: number) {
    const patient = await this.patientRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { patientId })
      .addSelect(['p.createdAt'])
      .leftJoinAndSelect('p.user', 'puser')
      .getOne();

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (patient.user!.id !== userId) {
      throw new ForbiddenException('Access to other user data denied');
    }

    return patient;
  }

  async getByPhoneNumber(phoneNumber: string) {
    const patient = await this.patientRepository.findOneBy({ phoneNumber });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: number, dto: UpdatePatientDto) {
    const patient = await this.getById(id);
    this.patientRepository.merge(patient, dto);
    const createdPatient = await this.patientRepository.save(patient);

    return this.patientRepository.findOneBy({ id: createdPatient.id });
  }

  async delete(id: number) {
    await this.patientRepository.delete(id);
  }
}
