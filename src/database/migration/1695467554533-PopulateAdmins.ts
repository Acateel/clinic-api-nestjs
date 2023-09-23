import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class PopulateAdmins1695467554533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `insert into public."user" (full_name, role, email, password) values ('Admin 1', 'ADMIN', 'admin-1@clinic.com', '${bcrypt.hashSync(
        '1234567',
        SALT_ROUNDS,
      )}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
