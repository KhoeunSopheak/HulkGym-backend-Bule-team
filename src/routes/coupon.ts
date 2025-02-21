import { Router } from "express";
import { getAllcoupons,CreateCoupon, GetCouponbyId } from "../controllers/coupon.controller";
import { checkTelegramData } from "../controllers/telegram.controller";

const router = Router();

//Coupon routes

router.post("/create", CreateCoupon);
router.get("/", getAllcoupons);
router.get("/:id", GetCouponbyId);
// router.put("/:id", updateBranch);
// router.delete("/:id", deleteBranch);

export default router;
