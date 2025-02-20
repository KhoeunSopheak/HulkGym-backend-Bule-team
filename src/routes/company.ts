import { Router } from "express";
import { createCompany, allCompany, firstCompany, updateCompany, deleteCompany } from "../controllers/company.controller";
import { checkTelegramData } from "../controllers/telegram.controller";

const router = Router();

router.post("/create", createCompany);
router.get("/companies", allCompany);
router.get("/:id", firstCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
