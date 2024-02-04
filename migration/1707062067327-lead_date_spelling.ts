import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadDateSpelling1707062067327 implements MigrationInterface {
    name = 'LeadDateSpelling1707062067327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" RENAME COLUMN "added_Date" TO "added_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" RENAME COLUMN "added_date" TO "added_Date"`);
    }

}
