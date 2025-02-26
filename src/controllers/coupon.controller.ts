import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Coupon } from "../entity/coupon.entity";

export const getAllcoupons = async (req: Request, res: Response)=>{
     const CouponRepo = AppDataSource.getRepository(Coupon);
    
        try {
            const couponResponse = await CouponRepo.find();
    
            return res.status(200).json({ message: "Branches get successfully", couponResponse });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
}


export const CreateCoupon = async (req: Request, res: Response)=>{
    const CouponRepo = AppDataSource.getRepository(Coupon);
    const { title, end_date, description, terms } = req.body;

    if (!title || !end_date || !description || !terms) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

   
        try {
               const coupon = new Coupon();
               coupon.title = title;
               coupon.end_date = end_date; //format date: 2025-03-30
               coupon.description = description;
               coupon.terms = terms;
       
               await CouponRepo.save(coupon);
       
               return res.status(201).json({ message: "coupon created successfully" });
           } catch (error) {
               console.error(error);
               return res.status(500).json({ message: "Internal server error" });
           }
}

export const GetCouponbyId = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Coupon);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
    }

    try {
        const Coupon = await branchRepo.findOneBy({id: id});
        if (!Coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        return res.status(200).json({ message: "Coupon get successfully", Coupon });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};