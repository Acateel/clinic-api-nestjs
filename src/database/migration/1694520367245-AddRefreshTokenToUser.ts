import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1694520367245 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1694520367245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refresh_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
    }

}
