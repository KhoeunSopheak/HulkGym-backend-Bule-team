import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1741156790346 implements MigrationInterface {
    name = 'Default1741156790346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "userEmail"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "userContact"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "chatId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_aa501b54a34b209ae9741074af9" UNIQUE ("chatId")`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_75798a41b0aaf7b5575094217d3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_9234e7bac72991a93b172618e2a" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."user_info_role_enum" AS ENUM('admin', 'user', 'editor')`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "role" "public"."user_info_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD CONSTRAINT "UQ_b1147f45c98336d22b93602574e" UNIQUE ("password")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_b1147f45c98336d22b93602574e"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_info_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "role" character varying(255) DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_9234e7bac72991a93b172618e2a"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_75798a41b0aaf7b5575094217d3"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP CONSTRAINT "UQ_aa501b54a34b209ae9741074af9"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "chatId"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "userContact" character varying`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "userEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "name" character varying NOT NULL`);
    }

}
