import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { UserService } from 'src/user/user.service';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { AppointmentTime, FindOptions } from 'src/common/interface';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DoctorAvailableSlotEntity } from 'src/database/entity/doctorAvailableSlots.entity';
import { checkIntervalsOverlap } from 'src/common/util';
import { InviteDoctorDto } from './dto/inviteDoctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, dto: CreateDoctorDto) {
    const user = await this.userService.getById(userId);
    const doctor = this.doctorRepository.create({ ...dto, user });
    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async get(options?: FindOptions<DoctorEntity>) {
    if (options?.order?.appointments) {
      return this.getOrderedByAppointmentCount();
    }

    try {
      return await this.doctorRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }
    }
  }

  private async getOrderedByAppointmentCount(
    options?: FindOptions<DoctorEntity>,
  ) {
    try {
      const queryBuilder = this.doctorRepository
        .createQueryBuilder('doctor')
        .select(
          (subQuery) =>
            subQuery
              .select('COUNT(appointment_id)', 'appointments_count')
              .from(AppointmentEntity, 'appointment')
              .where('appointment.doctorId = doctor.id'),
          'appointments',
        )
        .orderBy(options?.order as string);

      if (options?.where) {
        queryBuilder.where(options?.where as any);
      }
      if (options?.skip) {
        queryBuilder.skip(options?.skip as any);
      }
      if (options?.take) {
        queryBuilder.take(options?.take as any);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException('Unknown property');
      }
    }
  }

  async getById(id: number) {
    const doctor = await this.doctorRepository
      .createQueryBuilder('d')
      .where('d.id = :id', { id })
      .addSelect(['d.createdAt'])
      .leftJoinAndSelect('d.user', 'duser')
      .leftJoinAndSelect('d.appointments', 'dappointments')
      .leftJoinAndSelect('d.availableSlots', 'davailableSlots')
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    const doctor = await this.getById(id);
    this.doctorRepository.merge(doctor, dto);

    if (dto.availableSlots) {
      for (const freeSlot of dto.availableSlots) {
        const isFreeSlotTaken = doctor.appointments!.some((appointment) =>
          checkIntervalsOverlap(freeSlot, appointment),
        );

        if (isFreeSlotTaken) {
          throw new ConflictException(
            'Doctor has scheduled appointment on free slot time',
          );
        }
      }

      doctor.availableSlots = dto.availableSlots as DoctorAvailableSlotEntity[];
    }

    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async delete(id: number) {
    await this.doctorRepository.delete(id);
  }

  async takeAvailableSlot(id: number, time: AppointmentTime) {
    const doctor = await this.getById(id);
    const freeSlotIdx = doctor.availableSlots.findIndex((slot) =>
      checkIntervalsOverlap(slot, time),
    );

    if (freeSlotIdx < 0) {
      throw new ConflictException('Doctor is unavailable');
    }

    doctor.availableSlots.splice(freeSlotIdx, 1);

    return this.doctorRepository.save(doctor);
  }

  async invite(dto: InviteDoctorDto) {}
}
