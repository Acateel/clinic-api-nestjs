import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class PopulatePatients1695466278360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        id: 10,
        fullName: 'Patient 1',
        role: 'PATIENT',
        email: 'patient-1@clinic.com',
        password: '1234567',
      },
      {
        id: 20,
        fullName: 'Patient 2',
        role: 'PATIENT',
        email: 'patient-2@clinic.com',
        password: '1234567',
      },
      {
        id: 30,
        fullName: 'Patient 3',
        role: 'PATIENT',
        email: 'patient-3@clinic.com',
        password: '1234567',
      },
      {
        id: 40,
        fullName: 'Patient 4',
        role: 'PATIENT',
        email: 'patient-4@clinic.com',
        password: '1234567',
      },
      {
        id: 50,
        fullName: 'Patient 5',
        role: 'PATIENT',
        email: 'patient-5@clinic.com',
        password: '1234567',
      },
    ];

    const patients = [
      {
        phoneNumber: '+380990768001',
        userId: 10,
      },
      {
        phoneNumber: '+380990768002',
        userId: 20,
      },
      {
        phoneNumber: '+380990768003',
        userId: 30,
      },
      {
        phoneNumber: '+380990768004',
        userId: 40,
      },
      {
        phoneNumber: '+380990768005',
        userId: 50,
      },
    ];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);
      await queryRunner.query(`
        INSERT INTO public."user" (user_id, full_name, "role", email, password)
        VALUES (${user.id}, '${user.fullName}', '${user.role}', '${user.email}', '${user.password}');
      `);

      const patient = patients[i];
      await queryRunner.query(`
        INSERT INTO patient (user_id, phone_number)
        VALUES (${patient.userId}, '${patient.phoneNumber}');
    `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
