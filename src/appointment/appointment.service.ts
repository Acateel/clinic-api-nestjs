import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AppointmentTime } from 'src/common/interface';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { checkIntervalsOverlap } from 'src/common/util';
import { PatientEntity } from 'src/database/entity/patient.entity';

@Injectable()
export class AppointmentService {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.queryRunner = dataSource.createQueryRunner();
  }

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorRepository.findOneBy({ id: dto.doctorId });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patient = await this.patientRepository.findOneBy({
      id: dto.patientId,
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      doctor,
      patient,
    });

    this.queryRunner.release();
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();

    try {
      await this.takeDoctorAvailableSlot(doctor, appointment);
      const createdAppointment = await this.queryRunner.manager.save(
        appointment,
      );
      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async get(options) {
    const queryBuilder = this.appointmentRepository.createQueryBuilder('a');

    if (options.doctor) {
      queryBuilder.andWhere('a.doctor_id = :doctorId', {
        doctorId: options.doctor,
      });
    }

    if (options.patient) {
      queryBuilder.andWhere('a.patient_id = :patientId', {
        patientId: options.patient,
      });
    }

    return queryBuilder.getMany();
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
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    this.appointmentRepository.merge(appointment, dto);

    if (dto.patientId) {
      const patient = await this.patientRepository.findOneBy({
        id: dto.patientId,
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      appointment.patient = patient;
    }

    if (dto.doctorId) {
      const doctor = await this.doctorRepository.findOneBy({
        id: dto.doctorId,
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      appointment.doctor = doctor;
    }

    this.queryRunner.release();
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();

    try {
      const isDoctorOrTimeChanged =
        dto.doctorId || dto.startDate || dto.endDate;

      if (isDoctorOrTimeChanged) {
        await this.takeDoctorAvailableSlot(appointment.doctor!, appointment);
      }

      const createdAppointment = await this.queryRunner.manager.save(
        appointment,
      );

      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async delete(id: number) {
    await this.appointmentRepository.delete(id);
  }

  private async takeDoctorAvailableSlot(
    doctor: DoctorEntity,
    time: AppointmentTime,
  ) {
    const freeSlotIdx = doctor.availableSlots.findIndex((slot) =>
      checkIntervalsOverlap(slot, time),
    );

    if (freeSlotIdx < 0) {
      throw new ConflictException('Doctor is unavailable');
    }

    doctor.availableSlots.splice(freeSlotIdx, 1);

    if (this.queryRunner.isReleased) {
      this.queryRunner = this.dataSource.createQueryRunner();
    }

    await this.queryRunner.manager.save(doctor);
  }
}
