import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Membership } from "../entity/membership.entity";
import { UserInfo } from "../entity/user.entity";

export const CreateMembership = async (req: Request, res: Response) => {
    try {
        const membershipRepo = AppDataSource.getRepository(Membership);
        const userRepo = AppDataSource.getRepository(UserInfo);

        const { fullname, status, userId } = req.body;  // Get userId from request body

        // Validate required fields
        if (!fullname || !status || !userId) {
            return res.status(400).json({ message: "All fields (fullname, status, userId) are required" });
        }

        // Find the user in the database using userId from the body
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create and populate the membership object
        const membership = new Membership();
        membership.fullname = fullname;
        membership.status = status;
        membership.user = user;

        console.log("Membership Details:", {
            fullname: membership.fullname,
            status: membership.status,
            userId: membership.user?.id,
        });

        // Save membership to the database
        await membershipRepo.save(membership);

        return res.status(201).json({
            message: "Membership created successfully",
            membership,
        });

    } catch (error) {
        console.error("Error creating membership:", error);
        return res.status(500).json({ message: "Error creating membership" });
    }
};



export const GetAllMembership = async (req: Request, res: Response) => {
    try {
        const membershipRepo = AppDataSource.getRepository(Membership);
        const memberships = await membershipRepo.find(); 
        res.status(200).json({ memberships });
    } catch (error) {
        console.error('Error fetching memberships:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const GetByIdMembership = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const membershipRepo = AppDataSource.getRepository(Membership);

    try {
        const membership = await membershipRepo.findOne({
            where: { id }  
        });
        if (!membership) {
            console.log('Membership not found for id:', id); 
            return res.status(404).json({ message: 'Membership not found' });
        }
        res.status(200).json({
            membership: {
                fullname: membership.fullname, 
                status: membership.status,
                user: membership.user  
            }
        });
    } catch (error) {
        console.error('Error fetching membership:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// export const DeleteMembership = async (req: Request, res: Response) => {
//   const { id } = req.params; 
//   const membershipRepo = AppDataSource.getRepository(Membership);

//   try {

//     const membership = await membershipRepo.findOne({
//       where: { id }
//     });


//     if (!membership) {
//       console.log('Membership not found for id:', id); 
//       return res.status(404).json({ message: 'Membership not found' });
//     }

//     await membershipRepo.remove(membership); 
//     console.log('Membership deleted successfully');

//     return res.status(200).json({ message: 'Membership deleted successfully' });

//   } catch (error) {
//     console.error('Error deleting membership:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
