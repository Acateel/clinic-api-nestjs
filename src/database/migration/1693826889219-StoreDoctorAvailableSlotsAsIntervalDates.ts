import { MigrationInterface, QueryRunner } from 'typeorm';

export class StoreDoctorAvailableSlotsAsIntervalDates1693826889219
  implements MigrationInterface
{
  name = 'StoreDoctorAvailableSlotsAsIntervalDates1693826889219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_available_slot" ("doctor_available_slot_id" SERIAL NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "doctor_id" integer NOT NULL, CONSTRAINT "PK_141449d9418b9fac258054035b7" PRIMARY KEY ("doctor_available_slot_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP COLUMN "available_slots"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_available_slot" ADD CONSTRAINT "FK_bbcc74361192a1197a42920cdf8" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("doctor_id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_available_slot" DROP CONSTRAINT "FK_bbcc74361192a1197a42920cdf8"`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "end_date"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD "available_slots" TIMESTAMP WITH TIME ZONE array NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "doctor_available_slot"`);
  }
}
