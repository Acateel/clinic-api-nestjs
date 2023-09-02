import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDatesTimezone1693682418152 implements MigrationInterface {
  name = 'AddDatesTimezone1693682418152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP COLUMN "available_slots"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD "available_slots" TIMESTAMP WITH TIME ZONE array NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doctor" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP COLUMN "available_slots"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD "available_slots" TIMESTAMP array NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "date" TIMESTAMP NOT NULL`,
    );
  }
}
