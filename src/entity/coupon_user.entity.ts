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
  import { UserInfo } from './user.entity'; // Assuming UserInfo entity is in user.entity.ts
  import { Coupon } from './coupon.entity';
  
  @Entity('coupon_user')
  export class Coupon_User {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key
  
    @OneToOne(() => UserInfo, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: UserInfo; // Relationship with UserInfo entity
  
    @Column({ type: 'varchar', length: 30 })
    coupon_code: string; // Activity title
  
    @ManyToOne(() => Coupon, (coupon) => coupon.id)
    @JoinColumn({ name: 'couponId' })
    coupon: Coupon; 

    @Column({ type: 'int' })
    used: Number;  

    @CreateDateColumn()
    createAt: Date; // Timestamp of creation
  
    @UpdateDateColumn()
    updateAt: Date; // Timestamp of last update
  }
  