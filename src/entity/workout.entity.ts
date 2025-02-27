import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Workout_plan } from './workout_plan.entity';
  import { Exercise } from './exercise.entity';
  
  @Entity('workout')
  export class Workout {
    @PrimaryGeneratedColumn('uuid')
    id: string; // UUID as a primary key
  
    @ManyToOne(() => Workout_plan, (workout) => workout.workouts)
    @JoinColumn({ name: 'workout_plan_id' })
    workout_plan_id: Workout_plan;
  
    @Column({ type: 'varchar', length: 30 })
    type: string; 

    @CreateDateColumn()
    create_at: Date; 
  
    @UpdateDateColumn()
    update_at: Date;  

    @OneToMany(() => Exercise, (exercise: { workout: any; }) => exercise.workout)
    exercises: Exercise[]; // One Workout has many Exercises
  }
  