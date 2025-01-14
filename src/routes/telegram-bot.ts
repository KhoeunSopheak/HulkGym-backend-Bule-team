import { Router } from "express";
import { telegramController } from "../controllers/telegram.controller";

const router = Router();

router.post("/webhook", telegramController);

export default router;
