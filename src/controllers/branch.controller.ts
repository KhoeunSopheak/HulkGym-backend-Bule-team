import { Request, Response } from "express";
import { Branch } from "../entity/branch.entity";
import { AppDataSource } from "../config";
import { Company } from "../entity/company.entity";



export const createBranch = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Branch);
    const companyRepo = AppDataSource.getRepository(Company);

    const { name, location, open_time, close_time } = req.body;
    const companyId = req.params?.id;

    if (!name || !location || !open_time || !close_time) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const company = await companyRepo.findOne({
            where: { id: companyId }
        });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const branch = new Branch();
        branch.name = name;
        branch.location = location;
        branch.open_time = open_time;
        branch.close_time = close_time;
        branch.company_id = company;

        await branchRepo.save(branch);

        return res.status(201).json({ message: "Branch created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const allBranch = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Branch);

    try {
        const branches = await branchRepo.find();

        return res.status(200).json({ message: "Branches get successfully", branches });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const firstBranch = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Branch);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Branch ID is required" });
    }

    try {
        const branches = await branchRepo.findOneBy({id: id});
        if (!branches) {
            return res.status(404).json({ message: "Branch not found" });
        }

        return res.status(200).json({ message: "Branch get successfully", branches });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Branch);
    const { name, location, open_time, close_time } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Branch ID is required" });
    }

    try {
        const branchId = await branchRepo.findOneBy({id: id});
        if (!branchId) {
            return res.status(404).json({ message: "Branch not found" });
        }

        branchId.name = name;
        branchId.location = location;
        branchId.open_time = open_time;
        branchId.close_time = close_time;

        await branchRepo.save(branchId);


        return res.status(200).json({ message: "Branch updated successfully", branchId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    const branchRepo = AppDataSource.getRepository(Branch);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Branch ID is required" });
    }

    try {
        const branches = await branchRepo.findOneBy({id: id});
        if (!branches) {
            return res.status(404).json({ message: "Branch not found" });
        }

        await branchRepo.remove(branches);

        return res.status(200).json({ message: "Branch deleted successfully", branches });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


