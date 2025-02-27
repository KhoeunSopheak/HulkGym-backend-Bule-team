import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740643589846 implements MigrationInterface {
    name = 'Default1740643589846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "sets" integer NOT NULL, "reps" character varying(10) NOT NULL, "min_calories" integer NOT NULL, "max_calories" integer NOT NULL, "workoutIdId" uuid, CONSTRAINT "PK_a0f107e3a2ef2742c1e91d97c14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(30) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "workout_plan_id" uuid, CONSTRAINT "PK_ea37ec052825688082b19f0d939" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aea7bdb578979ab3fd974331f5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "end_date" date NOT NULL, "description" text NOT NULL, "percentage" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coupon_code" character varying(30) NOT NULL, "used" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "couponId" uuid, CONSTRAINT "REL_18d899040bcab86e9c98020eb1" UNIQUE ("userId"), CONSTRAINT "PK_05e2d1d174be912392277fc095c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "percentage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "terms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise" ADD CONSTRAINT "FK_ae8ccf97e19f6181bfbc483ef79" FOREIGN KEY ("workoutIdId") REFERENCES "workout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout" ADD CONSTRAINT "FK_bd79fa1530c5a242d309b85598d" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_user" ADD CONSTRAINT "FK_18d899040bcab86e9c98020eb13" FOREIGN KEY ("userId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_user" ADD CONSTRAINT "FK_2999f6eab3f76b0228d94bd9332" FOREIGN KEY ("couponId") REFERENCES "coupon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon_user" DROP CONSTRAINT "FK_2999f6eab3f76b0228d94bd9332"`);
        await queryRunner.query(`ALTER TABLE "coupon_user" DROP CONSTRAINT "FK_18d899040bcab86e9c98020eb13"`);
        await queryRunner.query(`ALTER TABLE "workout" DROP CONSTRAINT "FK_bd79fa1530c5a242d309b85598d"`);
        await queryRunner.query(`ALTER TABLE "exercise" DROP CONSTRAINT "FK_ae8ccf97e19f6181bfbc483ef79"`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "terms"`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "percentage" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "coupon_user"`);
        await queryRunner.query(`DROP TABLE "coupon"`);
        await queryRunner.query(`DROP TABLE "workout_plan"`);
        await queryRunner.query(`DROP TABLE "workout"`);
        await queryRunner.query(`DROP TABLE "exercise"`);
    }

}
