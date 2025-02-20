import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Company } from './company.entity'; // Assuming UserInfo entity is in user.entity.ts
  
  @Entity('branch')
  export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key
  
    @ManyToOne(() => Company, (branch) => branch.company)
    @JoinColumn({ name: 'company_id' })
    company_id: Company;
  
    @Column({ type: 'varchar', length: 30 })
    name: string; 
  
    @Column({ type: 'text' })
    location: string; 
  
    @Column({ type: 'time' })
    open_time: string; 
  
    @Column({ type: 'time' })
    close_time: string; 
  
    @CreateDateColumn()
    create_at: Date; 
  
    @UpdateDateColumn()
    update_at: Date; 

    @CreateDateColumn()
    create_by: Date; 

    @CreateDateColumn()
    update_by: Date; 
  }
  