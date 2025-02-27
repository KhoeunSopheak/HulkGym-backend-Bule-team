import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Pricing } from './pricing.entity'; // Assuming UserInfo entity is in user.entity.ts
@Entity('pricingfeature')
export class PricingFeature {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => Pricing, (pricing) => pricing.id)
    @JoinColumn({name:"membership_package_id"})
    membership_package_id: Pricing;

    @Column({ type: 'varchar', length: 255 })
    feature: string;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @CreateDateColumn()
    create_by: Date;

    @CreateDateColumn() 
    update_by: Date;

}
  

