import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SALT_ROUNDS } from 'src/common/constant';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { DoctorEntity } from '../entity/doctor.entity';
import { UserEntity } from '../entity/user.entity';

export class PopulateDoctors1695467542782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedDataPath = path.join(__dirname, '../seed/', 'doctors.seed.json');
    const seedData = await fs.readFile(seedDataPath, { encoding: 'utf-8' });
    const doctorsData: [{ user: UserEntity } & DoctorEntity] =
      JSON.parse(seedData);

    const users: UserEntity[] = doctorsData.map((d) => ({
      ...d.user,
      password: bcrypt.hashSync(d.user.password!, SALT_ROUNDS),
    }));
    const userRepository = queryRunner.connection.getRepository(UserEntity);
    await userRepository.insert(users);

    const doctors: DoctorEntity[] = await Promise.all(
      doctorsData.map(
        async (d) =>
          ({
            ...d,
            user: await userRepository.findOneBy({ email: d.user.email })!,
          } as DoctorEntity),
      ),
    );
    const doctorRepository = queryRunner.connection.getRepository(DoctorEntity);
    await doctorRepository.insert(doctors);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
