import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DataSource, EntityPropertyNotFoundError, Repository } from 'typeorm';
import { FindOptions } from 'src/common/interface';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorService.getById(dto.doctorId);
    const patient = await this.patientService.getById(dto.patientId);
    const appointment = this.appointmentRepository.create({
      ...dto,
      doctor,
      patient,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const freeSlotIdx = doctor.availableSlots.findIndex(
        (date) => date.toISOString() === dto.date,
      );

      if (freeSlotIdx < 0) {
        throw new ConflictException('Doctor is unavailable');
      }

      doctor.availableSlots.splice(freeSlotIdx, 1);
      await queryRunner.manager.save(doctor);

      const createdAppointment = await queryRunner.manager.save(appointment);
      await queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Doctor is unavailable');
    } finally {
      await queryRunner.release();
    }
  }

  async get(options?: FindOptions<AppointmentEntity>) {
    try {
      return await this.appointmentRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }
    }
  }

  async getById(id: number) {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .addSelect(['a.createdAt'])
      .leftJoinAndSelect('a.doctor', 'adoctor')
      .leftJoinAndSelect('a.patient', 'apatient')
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.getById(id);
    this.appointmentRepository.merge(appointment, dto);

    if (dto.date) {
      appointment.date = new Date(dto.date);
    }

    if (dto.patientId) {
      const patient = await this.patientService.getById(dto.patientId);
      appointment.patient = patient;
    }

    if (dto.doctorId) {
      const doctor = await this.doctorService.getById(dto.doctorId);
      appointment.doctor = doctor;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const createdAppointment = await queryRunner.manager.save(appointment);

      const freeSlotIdx = createdAppointment.doctor!.availableSlots.findIndex(
        (date) => date.toISOString() === createdAppointment.date.toISOString(),
      );

      if (freeSlotIdx < 0) {
        throw new ConflictException('Doctor is unavailable');
      }

      createdAppointment.doctor!.availableSlots.splice(freeSlotIdx, 1);
      await queryRunner.manager.save(createdAppointment.doctor!);
      await queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Doctor is unavailable');
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number) {
    await this.appointmentRepository.delete(id);
  }
}
