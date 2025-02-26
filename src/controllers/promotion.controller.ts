import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Promotion } from "../entity/promotion.entity";
export const getAllpromotions = async (req: Request, res: Response)=>{
     const promotionRepo = AppDataSource.getRepository(Promotion);
    
        try {
            const promotionResponse = await promotionRepo.find();
    
            return res.status(200).json({ message: "promotion get successfully", promotionResponse });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
}


export const CreatePromotion = async (req: Request, res: Response)=>{
    const promotionRepo = AppDataSource.getRepository(Promotion);
    const { title, description,end_date, percentage, branch } = req.body;

    if (!title || !end_date || !description || !percentage || !branch) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

   
        try {
               const promotion = new Promotion();
               promotion.title = title;
               promotion.end_date = end_date; //format date: 2025-03-30
               promotion.description = description;
               promotion.percentage = percentage;
               promotion.branch = branch;
       
               await promotionRepo.save(promotion);
       
               return res.status(201).json({ message: "promotion created successfully" });
           } catch (error) {
               console.error(error);
               return res.status(500).json({ message: "Internal server error" });
           }
}

export const GetPromotionbyId = async (req: Request, res: Response) => {
    const promotionRepo = AppDataSource.getRepository(Promotion);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
    }

    try {
        const promotion = await promotionRepo.findOneBy({id: id});
        if (!promotion) {
            return res.status(404).json({ message: "promotion not found" });
        }

        return res.status(200).json({ message: "promotion get successfully", promotion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};