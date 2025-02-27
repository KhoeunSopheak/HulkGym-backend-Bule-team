import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('pricing')
export class Pricing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    package_name: string;

    @Column({ type: 'varchar', length: 50 })
    price_by_month: string;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @CreateDateColumn()
    create_by: Date;

    @CreateDateColumn() 
    update_by: Date;

}
