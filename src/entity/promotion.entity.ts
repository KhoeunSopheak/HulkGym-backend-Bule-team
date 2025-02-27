import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToMany,
  } from 'typeorm';
  import { Branch } from './branch.entity';
  
  @Entity('promotion')
  export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key

    @Column({ type: 'text' })
    title: String;  

    @ManyToMany(() => Branch, (branch) => branch.id)
        @JoinColumn({ name: 'branchId' })
        branch: Branch; 
  
    @Column({ type: 'date' })
    end_date: Date;  

    @Column({ type: 'text' })
    description: String;  

    @Column({ type: 'int' })
    percentage: number;  

    @CreateDateColumn()
    createAt: Date; // Timestamp of creation
  
    @UpdateDateColumn()
    updateAt: Date; // Timestamp of last update
  }
  