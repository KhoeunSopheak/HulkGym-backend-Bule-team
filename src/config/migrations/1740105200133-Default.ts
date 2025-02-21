import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740105200133 implements MigrationInterface {
    name = 'Default1740105200133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" ADD "image_url" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "image_url"`);
    }

}
