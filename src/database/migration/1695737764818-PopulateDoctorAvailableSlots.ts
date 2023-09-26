import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DoctorEntity } from '../entity/doctor.entity';
import { DoctorAvailableSlotEntity } from '../entity/doctorAvailableSlot.entity';

export class PopulateDoctorAvailableSlots1695737764818
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedDataPath = path.join(
      __dirname,
      '../../../seed/',
      'appointmentsSeedData.json',
    );
    const seedData = await fs.readFile(seedDataPath, { encoding: 'utf-8' });
    const availableSlotsData = JSON.parse(seedData);

    const doctorRepository = queryRunner.connection.getRepository(DoctorEntity);

    const availableSlots = await Promise.all(
      availableSlotsData.map(async (s) => ({
        ...s,
        doctor: await doctorRepository.findOne({
          where: { user: { email: s.doctor.user.email } },
          relations: { user: true },
        }),
      })),
    );
    const doctorAvailableSlotRepository = queryRunner.connection.getRepository(
      DoctorAvailableSlotEntity,
    );
    await doctorAvailableSlotRepository.insert(availableSlots);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
