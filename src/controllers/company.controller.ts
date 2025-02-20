import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Company } from "../entity/company.entity";



export const createCompany = async (req: Request, res: Response) => {
    const companyRepo = AppDataSource.getRepository(Company);

    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const company = new Company();
        company.name = name;
        company.location = location;

        await companyRepo.save(company);

        return res.status(201).json({ message: "Company created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const allCompany = async (req: Request, res: Response) => {
    const companyRepo = AppDataSource.getRepository(Company);

    try {
        const companies = await companyRepo.find();

        return res.status(200).json({ message: "Compaies get successfully", companies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const firstCompany = async (req: Request, res: Response) => {
    const companyRepo = AppDataSource.getRepository(Company);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Company ID is required" });
    }

    try {
        const companies = await companyRepo.findOneBy({id: id});
        if (!companies) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json({ message: "Company get successfully", companies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    const companyRepo = AppDataSource.getRepository(Company);
    const { name, location } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Company ID is required" });
    }

    try {
        const companyId = await companyRepo.findOneBy({id: id});
        if (!companyId) {
            return res.status(404).json({ message: "Company not found" });
        }

        companyId.name = name;
        companyId.location = location;

        await companyRepo.save(companyId);


        return res.status(200).json({ message: "Company updated successfully", companyId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    const companyRepo = AppDataSource.getRepository(Company);
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Company ID is required" });
    }

    try {
        const companies = await companyRepo.findOneBy({id: id});
        if (!companies) {
            return res.status(404).json({ message: "Company not found" });
        }

        await companyRepo.remove(companies);

        return res.status(200).json({ message: "Company deleted successfully", companies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


