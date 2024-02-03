import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Lead } from "./lead";

type InteractionType= "email" | "call" |"meeting"

@Entity()
export class Interaction{
  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne("Lead",(lead:Lead)=>lead.interaction)
  @JoinColumn({name:"lead_id"})
  lead:Lead

  @Column({type:"enum",enum:["email","call","meeting"]})
  interaction_type: InteractionType

  @CreateDateColumn()
  interaction_date:Date
}
