import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { News } from "../entity/news.entity";
export const getAllnews = async (req: Request, res: Response)=>{
     const newsRepo = AppDataSource.getRepository(News);
    
        try {
            const nwesResponse = await newsRepo.find();
    
            return res.status(200).json({ message: "news get successfully", nwesResponse });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
}


export const Createnews = async (req: Request, res: Response)=>{
    const newsRepo = AppDataSource.getRepository(News);
    const { title, description,date, branch, qoute } = req.body;

    if (!title || !date || !description || !branch || !qoute) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

   
        try {
               const news = new News();
               news.title = title;
               news.date = date; //format date: 2025-03-30
               news.description = description;
               news.Location = branch;
               news.qoute = qoute;
       
               await newsRepo.save(news);
       
               return res.status(201).json({ message: "news created successfully" });
           } catch (error) {
               console.error(error);
               return res.status(500).json({ message: "Internal server error" });
           }
}

export const GetNewsbyId = async (req: Request, res: Response) => {
    const nwesRepo = AppDataSource.getRepository(News);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Coupon ID is required" });
    }

    try {
        const newRespone = await nwesRepo.findOneBy({id: id});
        if (!newRespone) {
            return res.status(404).json({ message: "News not found" });
        }

        return res.status(200).json({ message: "News get successfully", newRespone });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};