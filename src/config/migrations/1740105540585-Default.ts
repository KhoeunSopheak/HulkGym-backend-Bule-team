import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740105540585 implements MigrationInterface {
    name = 'Default1740105540585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" ADD "image_url" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "image_url"`);
    }

}
