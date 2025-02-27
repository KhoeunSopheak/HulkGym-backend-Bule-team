import { Router } from "express";
import { GetPromotionbyId, getAllpromotions, CreatePromotion } from "../controllers/promotion.controller";
// import { checkTelegramData } from "../controllers/telegram.controller";

const router = Router();

//Coupon routes

router.post("/create", CreatePromotion);
router.get("/", getAllpromotions);
router.get("/:id", GetPromotionbyId);
// router.put("/:id", updateBranch);
// router.delete("/:id", deleteBranch);

export default router;
