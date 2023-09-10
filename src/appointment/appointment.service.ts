import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { FindOptions } from 'src/common/interface';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorService.getById(dto.doctorId);
    const patient = await this.patientService.getById(dto.patientId);
    const appointment = this.appointmentRepository.create({
      ...dto,
      doctor,
      patient,
    });

    await this.doctorService.takeAvailableSlot(dto.doctorId, appointment);
    const createdAppointment = await this.appointmentRepository.save(
      appointment,
    );

    return this.appointmentRepository.findOneBy({
      id: createdAppointment.id,
    });
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

    if (dto.patientId) {
      const patient = await this.patientService.getById(dto.patientId);
      appointment.patient = patient;
    }

    if (dto.doctorId) {
      appointment.doctor = await this.doctorService.takeAvailableSlot(
        dto.doctorId,
        appointment,
      );
    }

    await this.appointmentRepository.save(appointment);

    return this.appointmentRepository.findOneBy({ id });
  }

  async delete(id: number) {
    await this.appointmentRepository.delete(id);
  }
}
