import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import {
  DataSource,
  EntityPropertyNotFoundError,
  QueryRunner,
  Repository,
} from 'typeorm';
import { AppointmentTime, FindOptions } from 'src/common/interface';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { checkIntervalsOverlap } from 'src/common/util';
import { PatientEntity } from 'src/database/entity/patient.entity';

@Injectable()
export class AppointmentService {
  private queryRunner: QueryRunner;

  constructor(
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.queryRunner = dataSource.createQueryRunner();
  }

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorService.getById(dto.doctorId);
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
      const createdAppointment = await this.queryRunner.manager.save(
        appointment,
      );
      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw new ConflictException('Doctor is unavailable');
      }

      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async get(options?: FindOptions<AppointmentEntity>) {
    try {
      return await this.appointmentRepository.find(options);
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message.replaceAll(`"`, `'`));
      }

      throw error;
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
      appointment.doctor = await this.doctorService.getById(dto.doctorId);
    }

    this.queryRunner.release();
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();

    try {
      const createdAppointment = await this.queryRunner.manager.save(
        appointment,
      );
      await this.takeDoctorAvailableSlot(
        createdAppointment.doctor!,
        createdAppointment,
      );
      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw new ConflictException('Doctor is unavailable');
      }

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
    // const freeSlotIdx = doctor.availableSlots.findIndex((slot) =>
    //   checkIntervalsOverlap(slot, time),
    // );
    // if (freeSlotIdx < 0) {
    //   throw new ConflictException('Doctor is unavailable');
    // }
    // doctor.availableSlots.splice(freeSlotIdx, 1);
    // if (this.queryRunner.isReleased) {
    //   this.queryRunner = this.dataSource.createQueryRunner();
    // }
    // await this.queryRunner.manager.save(doctor);
  }
}
