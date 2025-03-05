import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Workout } from "../entity/workout.entity";
import { Workout_plan } from "../entity/workout_plan.entity";



export const createWorkout = async (req: Request, res: Response) => {
    const workoutRepo = AppDataSource.getRepository(Workout);
    const workout_planRepo = AppDataSource.getRepository(Workout_plan);
    const { type } = req.body;
    const workout_planId = req.params?.id;


    if (!type) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const workout_plan = await workout_planRepo.findOne({
            where: { id: workout_planId }
        });

        if (!workout_plan) {
            return res.status(404).json({ message: "Workout plans not found" });
        }
        const workout = new Workout();
        workout.type = type;
        workout.workout_plan_id = workout_plan;

        await workoutRepo.save(workout);

        return res.status(201).json({ message: "Workout created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};