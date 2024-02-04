import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import type { Interaction } from "./interaction";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
type Source = "Web" | "Referral" | "Partner";

@Entity()
export class Lead extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lead_name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    type: "enum",
    enum: ["New", "Contacted", "Qualified", "Lost"],
    default: "New",
  })
  lead_status: LeadStatus;

  @Column({ type: "enum", enum: ["Web", "Referral", "Partner"] })
  source: Source;

  @CreateDateColumn()
  added_Date: Date;

  @OneToMany("Interaction", (interaction: Interaction) => interaction.lead)
  interaction: Interaction[];
}
