import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constant';

export class PopulateDoctors1695467542782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        id: 60,
        fullName: 'Doctor 1',
        role: 'DOCTOR',
        email: 'doctor-1@clinic.com',
        password: '1234567',
      },
      {
        id: 70,
        fullName: 'Doctor 2',
        role: 'DOCTOR',
        email: 'doctor-2@clinic.com',
        password: '1234567',
      },
      {
        id: 80,
        fullName: 'Doctor 3',
        role: 'DOCTOR',
        email: 'doctor-3@clinic.com',
        password: '1234567',
      },
      {
        id: 90,
        fullName: 'Doctor 4',
        role: 'DOCTOR',
        email: 'doctor-4@clinic.com',
        password: '1234567',
      },
      {
        id: 100,
        fullName: 'Doctor 5',
        role: 'DOCTOR',
        email: 'doctor-5@clinic.com',
        password: '1234567',
      },
    ];

    const doctors = [
      {
        speciality: 'Dentist',
      },
      {
        speciality: 'Psychologist',
      },
      {
        speciality: 'Therapeft',
      },
      {
        speciality: 'Dentist',
      },
      {
        speciality: 'Veterinar',
      },
    ];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);
      await queryRunner.query(`
              INSERT INTO public."user" (user_id, full_name, "role", email, password)
              VALUES (${user.id}, '${user.fullName}', '${user.role}', '${user.email}', '${user.password}');
            `);

      const doctor = doctors[i];
      await queryRunner.query(`
              INSERT INTO doctor (user_id, speciality)
              VALUES (${user.id}, '${doctor.speciality}');
          `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
