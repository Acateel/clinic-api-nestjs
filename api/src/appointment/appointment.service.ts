import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { PatientEntity } from 'src/database/entity/patient.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { QueryRunner, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetAppointmentQueryDto } from './dto/get-appointment-query.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  private queryRunner!: QueryRunner;

  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    private readonly doctorService: DoctorService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<AppointmentEntity | null> {
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

    const appointment = new AppointmentEntity();
    appointment.startDate = dto.startDate;
    appointment.endDate = dto.endDate;
    appointment.doctor = doctor;
    appointment.patient = patient;

    this.queryRunner =
      this.appointmentRepository.manager.connection.createQueryRunner();

    await this.queryRunner.startTransaction();

    try {
      await this.doctorService.takeAvailableSlot(doctor.id, appointment);
      const createdAppointment = await this.queryRunner.manager.save(
        appointment,
      );

      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: createdAppointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      // TODO:
      // BUG: Query runner already released. Cannot run queries anymore.
      // BUG: Transaction is not started yet, start transaction before committing or rolling it back.
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async get(query: GetAppointmentQueryDto): Promise<AppointmentEntity[]> {
    const queryBuilder =
      this.appointmentRepository.createQueryBuilder('appointment');

    if (query.doctor) {
      queryBuilder.andWhere('appointment.doctor_id = :doctorId', {
        doctorId: query.doctor,
      });
    }

    if (query.patient) {
      queryBuilder.andWhere('appointment.patient_id = :patientId', {
        patientId: query.patient,
      });
    }

    return queryBuilder.getMany();
  }

  async getById(id: number): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.id = :id', { id })
      .addSelect(['appointment.createdAt'])
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  @Transactional()
  async update(
    id: number,
    dto: UpdateAppointmentDto,
  ): Promise<AppointmentEntity | null> {
    const appointment = await this.appointmentRepository.findOneBy({ id });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.startDate = dto.startDate ?? appointment.startDate;
    appointment.endDate = dto.endDate ?? appointment.endDate;

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

    await this.appointmentRepository.update(appointment.id, appointment);
    const isDoctorOrTimeChanged = dto.doctorId || dto.startDate || dto.endDate;

    if (isDoctorOrTimeChanged) {
      await this.doctorService.takeAvailableSlot(
        appointment.doctor!.id,
        appointment,
      );
    }

    return this.appointmentRepository.findOneBy({
      id: appointment.id,
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.appointmentRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Appointment not found');
    }
  }
}
