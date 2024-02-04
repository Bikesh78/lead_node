import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Lead } from "./lead";

type InteractionType = "Email" | "Call" | "Meeting";

@Entity()
export class Interaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("Lead", (lead: Lead) => lead.interaction)
  @JoinColumn({ name: "lead_id" })
  lead: Lead;

  @Column({ type: "enum", enum: ["Email", "Call", "Meeting"] })
  interaction_type: InteractionType;

  @CreateDateColumn()
  interaction_date: Date;
}
