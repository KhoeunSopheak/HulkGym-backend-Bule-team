import { Router } from "express";
import { CreateMembership, DeleteMembership, GetAllMembership,GetByIdMembership } from "../controllers/membership";


const router = Router();
router.post("/create", CreateMembership);
router.get("/AllMembership", GetAllMembership);
router.get("/GetMembership/:id", GetByIdMembership);
router.delete("deletes/:id", DeleteMembership);




export default router;
