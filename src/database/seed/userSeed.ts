import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class UserSeed1693826889210 implements MigrationInterface {
  name = 'UserSeed1693826889210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        fullName: 'Admin',
        role: 'ADMIN',
        email: 'admin@test.com',
        password: 'test',
      },
      {
        fullName: 'Doctor',
        role: 'DOCTOR',
        email: 'doctor@test.com',
        password: 'test',
      },
      {
        fullName: 'Patient',
        role: 'PATIENT',
        email: 'patient@test.com',
        password: 'test',
      },
    ];

    for (const user of users) {
      user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);
      const query = `
            INSERT INTO "user" (full_name, "role", email, password)
            VALUES ('${user.fullName}', '${user.role}', '${user.email}', '${user.password}');
          `;

      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
