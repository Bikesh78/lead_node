import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnum1707047410044 implements MigrationInterface {
    name = 'ChangeEnum1707047410044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "lead_id"`);
        await queryRunner.query(`ALTER TYPE "public"."lead_lead_status_enum" RENAME TO "lead_lead_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."lead_lead_status_enum" AS ENUM('New', 'Contacted', 'Qualified', 'Lost')`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" TYPE "public"."lead_lead_status_enum" USING "lead_status"::"text"::"public"."lead_lead_status_enum"`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" SET DEFAULT 'New'`);
        await queryRunner.query(`DROP TYPE "public"."lead_lead_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."lead_source_enum" RENAME TO "lead_source_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."lead_source_enum" AS ENUM('Web', 'Referral', 'Partner')`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "source" TYPE "public"."lead_source_enum" USING "source"::"text"::"public"."lead_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lead_source_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."interaction_interaction_type_enum" RENAME TO "interaction_interaction_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."interaction_interaction_type_enum" AS ENUM('Email', 'Call', 'Meeting')`);
        await queryRunner.query(`ALTER TABLE "interaction" ALTER COLUMN "interaction_type" TYPE "public"."interaction_interaction_type_enum" USING "interaction_type"::"text"::"public"."interaction_interaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interaction_interaction_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."interaction_interaction_type_enum_old" AS ENUM('email', 'call', 'meeting')`);
        await queryRunner.query(`ALTER TABLE "interaction" ALTER COLUMN "interaction_type" TYPE "public"."interaction_interaction_type_enum_old" USING "interaction_type"::"text"::"public"."interaction_interaction_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."interaction_interaction_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."interaction_interaction_type_enum_old" RENAME TO "interaction_interaction_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."lead_source_enum_old" AS ENUM('web', 'referral', 'partner')`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "source" TYPE "public"."lead_source_enum_old" USING "source"::"text"::"public"."lead_source_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."lead_source_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."lead_source_enum_old" RENAME TO "lead_source_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."lead_lead_status_enum_old" AS ENUM('new', 'contacted', 'qualified', 'lost')`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" TYPE "public"."lead_lead_status_enum_old" USING "lead_status"::"text"::"public"."lead_lead_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "lead" ALTER COLUMN "lead_status" SET DEFAULT 'new'`);
        await queryRunner.query(`DROP TYPE "public"."lead_lead_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."lead_lead_status_enum_old" RENAME TO "lead_lead_status_enum"`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "lead_id" integer`);
    }

}
