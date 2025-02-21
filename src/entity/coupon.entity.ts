import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
  } from 'typeorm';
  
  @Entity('coupon')
  export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key

    @Column({ type: 'text' })
    title: String;  
  
    @Column({ type: 'date' })
    end_date: Date;  

    @Column({ type: 'text' })
    description: String;  

    @Column({ type: 'text' })
    terms: String;  

    @CreateDateColumn()
    createAt: Date; // Timestamp of creation
  
    @UpdateDateColumn()
    updateAt: Date; // Timestamp of last update
  }
  