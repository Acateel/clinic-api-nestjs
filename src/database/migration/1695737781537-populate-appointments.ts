import * as fs from 'fs/promises';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { AppointmentEntity } from '../entity/appointment.entity';
import { DoctorEntity } from '../entity/doctor.entity';
import { PatientEntity } from '../entity/patient.entity';

export class PopulateAppointments1695737781537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedDataPath = path.join(
      __dirname,
      '../../../seed/',
      'appointments.seed.json',
    );
    const seedData = await fs.readFile(seedDataPath, { encoding: 'utf-8' });
    const doctorAvailableSlotsData = JSON.parse(seedData);

    const doctorRepository = queryRunner.connection.getRepository(DoctorEntity);
    const patientRepository =
      queryRunner.connection.getRepository(PatientEntity);

    const appointments = await Promise.all(
      doctorAvailableSlotsData.map(async (d) => ({
        ...d,
        doctor: await doctorRepository.findOne({
          where: { user: { email: d.doctor.user.email } },
          relations: { user: true },
        }),
        patient: await patientRepository.findOne({
          where: { user: { email: d.patient.user.email } },
          relations: { user: true },
        }),
      })),
    );
    const appointmentRepository =
      queryRunner.connection.getRepository(AppointmentEntity);
    await appointmentRepository.insert(appointments);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
