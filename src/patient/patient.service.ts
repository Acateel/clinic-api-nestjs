import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityPropertyNotFoundError,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PatientEntity } from '../database/entity/patient.entity';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UserService } from 'src/user/user.service';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { FindOptions } from '../common/interface';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreatePatientDto) {
    const user = await this.userService.find({ id: userId });
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
    }
  }

  async getById(id: string) {
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

  async update(id: string, dto: UpdatePatientDto) {
    const patient = await this.getById(id);
    this.patientRepository.merge(patient, dto);
    const createdPatient = await this.patientRepository.save(patient);

    return this.patientRepository.findOneBy({ id: createdPatient.id });
  }

  async delete(id: string) {
    await this.patientRepository.delete(id);
  }

  async find(options: Partial<PatientEntity>) {
    const patient = await this.patientRepository.findOneBy(
      options as FindOptionsWhere<PatientEntity>,
    );

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }
}
