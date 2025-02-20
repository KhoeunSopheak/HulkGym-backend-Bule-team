import { Router } from "express";
import { createBranch, allBranch, firstBranch, updateBranch, deleteBranch } from "../controllers/branch.controller";
import { checkTelegramData } from "../controllers/telegram.controller";

const router = Router();

router.post("/create", createBranch);
router.get("/branches", allBranch);
router.get("/:id", firstBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;
