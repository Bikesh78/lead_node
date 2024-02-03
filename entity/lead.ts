import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail } from "class-validator";

type LeadStatus = "new" | "contacted" | "qualified" | "lost"
type Source = "web" | "referral" | "partner"

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  lead_name: string

  @Column({ unique: true })
  @IsEmail()
  email: string

  @Column({ type: "enum", enum: ["new", "contacted", "qualified", "lost"], default: "new" })
  lead_status: LeadStatus

  @Column({ type: "enum", enum: ["web", "referral", "partner"] })
  source: Source

  @CreateDateColumn()
  added_Date: Date
}
