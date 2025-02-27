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
  
  @Entity('news')
  export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key

    @Column({ type: 'text' })
    title: String;  

    @ManyToMany(() => Branch, (branch) => branch.id)
        @JoinColumn({ name: 'branchId' })
        Location: Branch; 
  
    @Column({ type: 'date' })
    date: Date;  

    @Column({ type: 'text' })
    description: String;  

    @Column({ type: 'text' })
    qoute: String;  

    @CreateDateColumn()
    createAt: Date; // Timestamp of creation
  
    @UpdateDateColumn()
    updateAt: Date; // Timestamp of last update
  }
  