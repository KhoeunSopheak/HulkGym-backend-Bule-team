import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740700939042 implements MigrationInterface {
    name = 'Default1740700939042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_name" character varying(50) NOT NULL, "price_by_month" character varying(50) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pricingfeature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feature" character varying(255) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), "membership_package_id" uuid, CONSTRAINT "PK_2d41e4bb00d58215cda0bae756b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "create_by"`);
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "update_by"`);
        await queryRunner.query(`ALTER TABLE "branch" ADD "image" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workout_plan" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "workout_plan" ADD "name" character varying(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pricingfeature" ADD CONSTRAINT "FK_36f834700e5e4fe88d51d2c2492" FOREIGN KEY ("membership_package_id") REFERENCES "pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pricingfeature" DROP CONSTRAINT "FK_36f834700e5e4fe88d51d2c2492"`);
        await queryRunner.query(`ALTER TABLE "workout_plan" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "workout_plan" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "branch" ADD "update_by" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "branch" ADD "create_by" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "pricingfeature"`);
        await queryRunner.query(`DROP TABLE "pricing"`);
    }

}
