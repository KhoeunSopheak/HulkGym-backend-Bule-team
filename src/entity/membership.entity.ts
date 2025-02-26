import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserInfo } from "./user.entity";

@Entity("membership")
export class Membership {
  @PrimaryGeneratedColumn("uuid")
  id: string; //// UUID as a primary key

  @OneToOne(() => UserInfo)
  @JoinColumn({ name: "user_id" })
  user: UserInfo; 

//   @ManyToOne(() => Plan_subscribe, (membership) => membership.Plan_subscribe)
//   @JoinColumn({ name: planscribe_id })
//   planscribe_id: Plan_subscribe;

  @Column({ type: "varchar", length: 30 })
  fullname: string;

  @Column({ type: "text" })
  status: string;

  @CreateDateColumn()
  createAt: Date; // Timestamp of creation

  @UpdateDateColumn()
  updateAt: Date; // Timestamp of last update
}
