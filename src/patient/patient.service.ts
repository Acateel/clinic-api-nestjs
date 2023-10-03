import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'src/common/enum';
import { UserEntity } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from '../common/interface';
import { PatientEntity } from '../database/entity/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreatePatientDto, payload: AccessTokenPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const patientWithSamePhone = await this.patientRepository.findOneBy({
      phoneNumber: dto.phoneNumber,
    });

    if (patientWithSamePhone) {
      throw new BadRequestException('Phone number is allready in use');
    }

    const createdPatient = await this.patientRepository.save({ ...dto, user });

    return this.patientRepository.findOneBy({ id: createdPatient.id });
  }

  async get(options) {
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    if (options.phoneNumber) {
      queryBuilder.andWhere('patient.phoneNumber = :phoneNumber', {
        phoneNumber: `+${options.phoneNumber}`,
      });
    }

    if (options.fullName) {
      queryBuilder.leftJoin('patient.user', 'user');
      queryBuilder.andWhere('user.fullName = :fullName', {
        fullName: options.fullName,
      });
    }

    return queryBuilder.getMany();
  }

  async getById(id: number, payload: AccessTokenPayload) {
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.id = :id', { id })
      .addSelect(['patient.createdAt'])
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('patient.appointments', 'appointment')
      .getOne();

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (
      payload.role === UserRoleEnum.PATIENT &&
      patient.userId !== payload.id
    ) {
      throw new ForbiddenException('Cannot access other user data');
    }

    return patient;
  }

  async update(id: number, dto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOneBy({ id });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (dto.phoneNumber) {
      const patientWithSamePhone = await this.patientRepository.findOneBy({
        phoneNumber: dto.phoneNumber,
      });

      if (patientWithSamePhone) {
        throw new BadRequestException('Phone number is allready in use');
      }

      patient.phoneNumber = dto.phoneNumber;
    }

    // TODO:
    const { userId, appointmentIds, ...updateData } = patient;

    await this.patientRepository.update(patient.id, updateData);

    return this.patientRepository.findOneBy({ id: patient.id });
  }

  async delete(id: number) {
    await this.patientRepository.delete(id);
  }
}
