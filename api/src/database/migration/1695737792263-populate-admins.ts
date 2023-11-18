import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SALT_ROUNDS } from 'src/common/constant';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

export class PopulateAdmins1695737792263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seedDataPath = path.join(
      __dirname,
      '../../../seed/',
      'admins.seed.json',
    );
    const seedData = await fs.readFile(seedDataPath, { encoding: 'utf-8' });
    const adminsData = JSON.parse(seedData);

    const users: UserEntity[] = adminsData.map((a) => ({
      ...a,
      password: bcrypt.hashSync(a.password!, SALT_ROUNDS),
    }));
    const userRepository = queryRunner.connection.getRepository(UserEntity);
    await userRepository.insert(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
