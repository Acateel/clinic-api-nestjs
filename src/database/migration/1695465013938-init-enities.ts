import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitEnities1695465013938 implements MigrationInterface {
  name = 'InitEnities1695465013938'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "department" (
                "department_id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "parent_department_id" integer,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_28a598987c3302c0b4dfc71f868" PRIMARY KEY ("department_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "doctor_available_slot" (
                "doctor_available_slot_id" SERIAL NOT NULL,
                "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "doctor_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_141449d9418b9fac258054035b7" PRIMARY KEY ("doctor_available_slot_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "feedback" (
                "feedback_id" SERIAL NOT NULL,
                "feedback_type" character varying NOT NULL,
                "like_count" integer NOT NULL DEFAULT '0',
                "dislike_count" integer NOT NULL DEFAULT '0',
                "text" character varying,
                "user_id" integer NOT NULL,
                "doctor_id" integer,
                "parent_comment_id" integer,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_05e0741767903afe9fca96d1e9d" PRIMARY KEY ("feedback_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "doctor" (
                "doctor_id" SERIAL NOT NULL,
                "speciality" character varying NOT NULL,
                "user_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e2959c517497025482609c0166c" PRIMARY KEY ("doctor_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "appointment" (
                "appointment_id" SERIAL NOT NULL,
                "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "patient_id" integer NOT NULL,
                "doctor_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ee9f73735a635356d4da9bd3e69" PRIMARY KEY ("appointment_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "patient" (
                "patient_id" SERIAL NOT NULL,
                "phone_number" character varying NOT NULL,
                "user_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_695ad9605c02e61178645e10447" UNIQUE ("phone_number"),
                CONSTRAINT "PK_bd1c8f471a2198c19f43987ab05" PRIMARY KEY ("patient_id")
            )
        `)
    await queryRunner.query(`
            CREATE TYPE "public"."user_notification_type_enum" AS ENUM('REVIEW_COMMENTED', 'APPOINTMENT_UPCOMING')
        `)
    await queryRunner.query(`
            CREATE TABLE "user_notification" (
                "review_notification_id" SERIAL NOT NULL,
                "type" "public"."user_notification_type_enum" NOT NULL,
                "text" character varying NOT NULL,
                "is_seen" boolean NOT NULL DEFAULT false,
                "user_id" integer NOT NULL,
                "feedback_id" integer,
                "appointment_id" integer,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b9ed6502b6391dc2184adb496fe" PRIMARY KEY ("review_notification_id")
            )
        `)
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('DOCTOR', 'PATIENT', 'ADMIN')
        `)
    await queryRunner.query(`
            CREATE TABLE "user" (
                "user_id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL,
                "full_name" character varying NOT NULL,
                "avatar" character varying,
                "reset_token" character varying,
                "refresh_token" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "doctor_departments_department" (
                "doctor_doctor_id" integer NOT NULL,
                "department_department_id" integer NOT NULL,
                CONSTRAINT "PK_35dc9f1fd3b50cf6dc6ba814841" PRIMARY KEY ("doctor_doctor_id", "department_department_id")
            )
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_c36f955819d06df4fa70d42130" ON "doctor_departments_department" ("doctor_doctor_id")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_13f653912a0144e3fd8995ab82" ON "doctor_departments_department" ("department_department_id")
        `)
    await queryRunner.query(`
            ALTER TABLE "department"
            ADD CONSTRAINT "FK_03ef296dd53d939a99286ebeca6" FOREIGN KEY ("parent_department_id") REFERENCES "department"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_available_slot"
            ADD CONSTRAINT "FK_bbcc74361192a1197a42920cdf8" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback"
            ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback"
            ADD CONSTRAINT "FK_8978ace7b1879155c9a91c65628" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback"
            ADD CONSTRAINT "FK_f80407ef99e8f278e222e365651" FOREIGN KEY ("parent_comment_id") REFERENCES "feedback"("feedback_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor"
            ADD CONSTRAINT "FK_a685e79dc974f768c39e5d12281" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD CONSTRAINT "FK_86b3e35a97e289071b4785a1402" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD CONSTRAINT "FK_9a9c484aa4a944eaec632e00a81" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "patient"
            ADD CONSTRAINT "FK_f20f0bf6b734938c710e12c2782" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification"
            ADD CONSTRAINT "FK_ed67d2f825f4103de44ec3b6ba7" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification"
            ADD CONSTRAINT "FK_39fedc87fd911696575fc18ab0c" FOREIGN KEY ("feedback_id") REFERENCES "feedback"("feedback_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification"
            ADD CONSTRAINT "FK_3654653867a3e70519844e12766" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_departments_department"
            ADD CONSTRAINT "FK_c36f955819d06df4fa70d42130e" FOREIGN KEY ("doctor_doctor_id") REFERENCES "doctor"("doctor_id") ON DELETE NO ACTION ON UPDATE CASCADE
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_departments_department"
            ADD CONSTRAINT "FK_13f653912a0144e3fd8995ab821" FOREIGN KEY ("department_department_id") REFERENCES "department"("department_id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            CREATE VIEW "doctor_appointments_summary_entity" AS
            SELECT ROW_NUMBER() OVER (
                    ORDER BY 1
                )::integer as summary_id,
                "doctor"."doctor_id",
                full_name,
                array_agg(distinct department_id) as department_ids,
                count(*)::integer as appointment_count,
                extract (
                    week
                    from start_date
                )::integer as week_number,
                min(start_date) as week_min_date
            FROM "doctor" "doctor"
                INNER JOIN "user" "user" ON "user"."user_id" = "doctor"."user_id"
                INNER JOIN "doctor_departments_department" "doctor_department" ON "doctor_department"."doctor_doctor_id" = "doctor"."doctor_id"
                INNER JOIN "department" "department" ON "department"."department_id" = "doctor_department"."department_department_id"
                INNER JOIN "appointment" "appointment" ON "appointment"."doctor_id" = "doctor"."doctor_id"
            GROUP BY "doctor"."doctor_id",
                full_name,
                week_number
            ORDER BY week_number ASC,
                appointment_count DESC
        `)
    await queryRunner.query(
      `
            INSERT INTO "typeorm_metadata"(
                    "database",
                    "schema",
                    "table",
                    "type",
                    "name",
                    "value"
                )
            VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)
        `,
      [
        'public',
        'VIEW',
        'doctor_appointments_summary_entity',
        'SELECT ROW_NUMBER() OVER (ORDER BY 1)::integer as summary_id, "doctor"."doctor_id", full_name, array_agg(distinct department_id) as department_ids, count(*)::integer as appointment_count, extract (week from start_date)::integer as week_number, min(start_date) as week_min_date FROM "doctor" "doctor" INNER JOIN "user" "user" ON "user"."user_id"="doctor"."user_id"  INNER JOIN "doctor_departments_department" "doctor_department" ON "doctor_department"."doctor_doctor_id"="doctor"."doctor_id" INNER JOIN "department" "department" ON "department"."department_id"="doctor_department"."department_department_id"  INNER JOIN "appointment" "appointment" ON "appointment"."doctor_id"="doctor"."doctor_id" GROUP BY "doctor"."doctor_id", full_name, week_number ORDER BY week_number ASC, appointment_count DESC',
      ]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "name" = $2
                AND "schema" = $3
        `,
      ['VIEW', 'doctor_appointments_summary_entity', 'public']
    )
    await queryRunner.query(`
            DROP VIEW "doctor_appointments_summary_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_departments_department" DROP CONSTRAINT "FK_13f653912a0144e3fd8995ab821"
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_departments_department" DROP CONSTRAINT "FK_c36f955819d06df4fa70d42130e"
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification" DROP CONSTRAINT "FK_3654653867a3e70519844e12766"
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification" DROP CONSTRAINT "FK_39fedc87fd911696575fc18ab0c"
        `)
    await queryRunner.query(`
            ALTER TABLE "user_notification" DROP CONSTRAINT "FK_ed67d2f825f4103de44ec3b6ba7"
        `)
    await queryRunner.query(`
            ALTER TABLE "patient" DROP CONSTRAINT "FK_f20f0bf6b734938c710e12c2782"
        `)
    await queryRunner.query(`
            ALTER TABLE "appointment" DROP CONSTRAINT "FK_9a9c484aa4a944eaec632e00a81"
        `)
    await queryRunner.query(`
            ALTER TABLE "appointment" DROP CONSTRAINT "FK_86b3e35a97e289071b4785a1402"
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor" DROP CONSTRAINT "FK_a685e79dc974f768c39e5d12281"
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback" DROP CONSTRAINT "FK_f80407ef99e8f278e222e365651"
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback" DROP CONSTRAINT "FK_8978ace7b1879155c9a91c65628"
        `)
    await queryRunner.query(`
            ALTER TABLE "feedback" DROP CONSTRAINT "FK_121c67d42dd543cca0809f59901"
        `)
    await queryRunner.query(`
            ALTER TABLE "doctor_available_slot" DROP CONSTRAINT "FK_bbcc74361192a1197a42920cdf8"
        `)
    await queryRunner.query(`
            ALTER TABLE "department" DROP CONSTRAINT "FK_03ef296dd53d939a99286ebeca6"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_13f653912a0144e3fd8995ab82"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_c36f955819d06df4fa70d42130"
        `)
    await queryRunner.query(`
            DROP TABLE "doctor_departments_department"
        `)
    await queryRunner.query(`
            DROP TABLE "user"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `)
    await queryRunner.query(`
            DROP TABLE "user_notification"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."user_notification_type_enum"
        `)
    await queryRunner.query(`
            DROP TABLE "patient"
        `)
    await queryRunner.query(`
            DROP TABLE "appointment"
        `)
    await queryRunner.query(`
            DROP TABLE "doctor"
        `)
    await queryRunner.query(`
            DROP TABLE "feedback"
        `)
    await queryRunner.query(`
            DROP TABLE "doctor_available_slot"
        `)
    await queryRunner.query(`
            DROP TABLE "department"
        `)
  }
}
