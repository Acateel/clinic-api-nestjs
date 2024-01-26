import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTime } from 'src/common/interface';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DoctorAvailableSlotEntity } from 'src/database/entity/doctor-available-slot.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { PatientEntity } from 'src/database/entity/patient.entity';
import { QueryRunner, Repository } from 'typeorm';
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

  async update(
    id: number,
    dto: UpdateAppointmentDto,
  ): Promise<AppointmentEntity | null> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: { doctor: true },
    });

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

    this.queryRunner =
      this.appointmentRepository.manager.connection.createQueryRunner();
    await this.queryRunner.startTransaction();

    try {
      const isDoctorOrTimeChanged =
        dto.doctorId || dto.startDate || dto.endDate;

      if (isDoctorOrTimeChanged) {
        await this.takeDoctorAvailableSlot(appointment.doctor!, appointment);
      }

      await this.queryRunner.manager.update(
        AppointmentEntity,
        appointment.id,
        appointment,
      );

      await this.queryRunner.commitTransaction();

      return this.appointmentRepository.findOneBy({
        id: appointment.id,
      });
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await this.queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.appointmentRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Appointment not found');
    }
  }

  private async takeDoctorAvailableSlot(
    doctor: DoctorEntity,
    time: AppointmentTime,
  ): Promise<void> {
    const availableSlot = await this.queryRunner.manager.findOneBy(
      DoctorAvailableSlotEntity,
      {
        doctorId: doctor.id,
        startDate: time.startDate,
        endDate: time.endDate,
      },
    );

    if (!availableSlot) {
      throw new ConflictException('Doctor is unavailable');
    }

    await this.queryRunner.manager.remove(availableSlot);
  }
}
