import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLead1706975233723 implements MigrationInterface {
    name = 'CreateLead1706975233723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lead_lead_status_enum" AS ENUM('new', 'contacted', 'qualified', 'lost')`);
        await queryRunner.query(`CREATE TYPE "public"."lead_source_enum" AS ENUM('web', 'referral', 'partner')`);
        await queryRunner.query(`CREATE TABLE "lead" ("id" SERIAL NOT NULL, "lead_name" character varying NOT NULL, "email" character varying NOT NULL, "lead_status" "public"."lead_lead_status_enum" NOT NULL DEFAULT 'new', "source" "public"."lead_source_enum" NOT NULL, "added_Date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_82927bc307d97fe09c616cd3f58" UNIQUE ("email"), CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lead"`);
        await queryRunner.query(`DROP TYPE "public"."lead_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lead_lead_status_enum"`);
    }

}
