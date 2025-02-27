import { Router } from "express";
import { GetNewsbyId,getAllnews,Createnews } from "../controllers/news.controller";
import { checkTelegramData } from "../controllers/telegram.controller";

const router = Router();

//Coupon routes

router.post("/create", Createnews);
router.get("/", getAllnews);
router.get("/:id", GetNewsbyId);
// router.put("/:id", updateBranch);
// router.delete("/:id", deleteBranch);

export default router;
