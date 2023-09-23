import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseSetup1695386108297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT');
      
      CREATE TABLE public."user" (
        user_id serial primary key,
        email varchar not null unique,
        password varchar not null,
        full_name varchar not null,
        reset_token varchar,
        refresh_token varchar,
        role user_role_enum not null,
        created_at timestamptz
      );
      
      create table patient (
        patient_id serial primary key,
        phone_number varchar unique not null,
        user_id integer not null references "user" on delete cascade,
        created_at timestamptz
      );

      create table doctor (
        doctor_id serial primary key,
        speciality varchar not null,
        user_id integer not null references "user" on delete cascade,
        created_at timestamptz
      );

      create table doctor_available_slot (
        doctor_available_slot_id serial primary key,
        start_date timestamptz not null,
        end_date timestamptz not null,
        doctor_id integer not null references doctor on delete cascade,
        created_at timestamptz
      );

      create table appointment (
        appointment_id serial primary key,
        start_date timestamptz not null,
        end_date timestamptz not null,
        patient_id integer not null references patient on delete cascade,
        doctor_id integer not null references doctor on delete cascade,
        created_at timestamptz
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
