import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInteraction1706977868229 implements MigrationInterface {
    name = 'CreateInteraction1706977868229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."interaction_interaction_type_enum" AS ENUM('email', 'call', 'meeting')`);
        await queryRunner.query(`CREATE TABLE "interaction" ("id" SERIAL NOT NULL, "interaction_type" "public"."interaction_interaction_type_enum" NOT NULL, "interaction_date" TIMESTAMP NOT NULL DEFAULT now(), "lead_id" integer, CONSTRAINT "PK_9204371ccb2c9dab5428b406413" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "interaction" ADD CONSTRAINT "FK_1f26581b794bb7084f26ecb323d" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interaction" DROP CONSTRAINT "FK_1f26581b794bb7084f26ecb323d"`);
        await queryRunner.query(`DROP TABLE "interaction"`);
        await queryRunner.query(`DROP TYPE "public"."interaction_interaction_type_enum"`);
    }

}
