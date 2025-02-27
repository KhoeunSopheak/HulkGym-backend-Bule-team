import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Workout } from './workout.entity';

@Entity('exercise')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; 

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'varchar', length: 10 })
  reps: string;

  @Column({ type: 'int' })
  min_calories: number;

  @Column({ type: 'int' })
  max_calories: number;

  @ManyToOne(() => Workout, (workout) => workout.exercises)
  workout_id: Workout; // Many Exercises belong to one Workout
}
