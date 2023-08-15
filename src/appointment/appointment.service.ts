import { ConflictException, Injectable } from '@nestjs/common';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DataSource, Repository } from 'typeorm';

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
    const doctor = await this.doctorService.find({ id: dto.doctorId });
    const freeSlotIdx = doctor.availableSlots.findIndex(
      (date) => date.toISOString() === dto.date,
    );

    if (freeSlotIdx < 0) {
      throw new ConflictException('Doctor is unavailable');
    }

    const patient = await this.patientService.find({ id: dto.patientId });
    const appointment = this.appointmentRepository.create({
      ...dto,
      doctor,
      patient,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // TODO: Use doctor service or not
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
    }
  }
}
