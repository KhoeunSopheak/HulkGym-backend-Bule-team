import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Workout } from './workout.entity';
  
  @Entity('workout_plan')
  export class Workout_plan {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as primary key
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    name: string;
  
    @CreateDateColumn()
    create_at: Date;
  
    @UpdateDateColumn()
    update_at: Date;
  
    @OneToMany(() => Workout, (workout) => workout.workout_plan_id)
    workouts: Workout[]; // One Workout_plan has many Workouts
  }
  