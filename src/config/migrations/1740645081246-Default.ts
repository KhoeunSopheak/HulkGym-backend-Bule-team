import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740645081246 implements MigrationInterface {
    name = 'Default1740645081246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "location" text NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "location" text NOT NULL, "open_time" TIME NOT NULL, "close_time" TIME NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "end_date" date NOT NULL, "description" text NOT NULL, "percentage" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_name" character varying(50) NOT NULL, "price_by_month" character varying(50) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pricingfeature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feature" character varying(255) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "create_by" TIMESTAMP NOT NULL DEFAULT now(), "update_by" TIMESTAMP NOT NULL DEFAULT now(), "membership_package_id" uuid, CONSTRAINT "PK_2d41e4bb00d58215cda0bae756b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coupon_code" character varying(30) NOT NULL, "used" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "couponId" uuid, CONSTRAINT "REL_18d899040bcab86e9c98020eb1" UNIQUE ("userId"), CONSTRAINT "PK_05e2d1d174be912392277fc095c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "percentage" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "terms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branch" ADD CONSTRAINT "FK_876085341242e41592b0e6b15e0" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pricingfeature" ADD CONSTRAINT "FK_36f834700e5e4fe88d51d2c2492" FOREIGN KEY ("membership_package_id") REFERENCES "pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_user" ADD CONSTRAINT "FK_18d899040bcab86e9c98020eb13" FOREIGN KEY ("userId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupon_user" ADD CONSTRAINT "FK_2999f6eab3f76b0228d94bd9332" FOREIGN KEY ("couponId") REFERENCES "coupon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon_user" DROP CONSTRAINT "FK_2999f6eab3f76b0228d94bd9332"`);
        await queryRunner.query(`ALTER TABLE "coupon_user" DROP CONSTRAINT "FK_18d899040bcab86e9c98020eb13"`);
        await queryRunner.query(`ALTER TABLE "pricingfeature" DROP CONSTRAINT "FK_36f834700e5e4fe88d51d2c2492"`);
        await queryRunner.query(`ALTER TABLE "branch" DROP CONSTRAINT "FK_876085341242e41592b0e6b15e0"`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "terms"`);
        await queryRunner.query(`ALTER TABLE "coupon" DROP COLUMN "percentage"`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD "percentage" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "coupon_user"`);
        await queryRunner.query(`DROP TABLE "pricingfeature"`);
        await queryRunner.query(`DROP TABLE "pricing"`);
        await queryRunner.query(`DROP TABLE "coupon"`);
        await queryRunner.query(`DROP TABLE "branch"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
