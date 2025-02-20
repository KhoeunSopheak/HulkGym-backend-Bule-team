import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('company')
  export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key
  
    @Column({ type: 'varchar', length: 30 })
    name: string; 
  
    @Column({ type: 'text' })
    location: string; 
  
    @CreateDateColumn()
    create_at: Date; 
  
    @UpdateDateColumn()
    update_at: Date; 

    @CreateDateColumn()
    create_by: Date; 

    @CreateDateColumn()
    update_by: Date; 
      company: any;
  }
  