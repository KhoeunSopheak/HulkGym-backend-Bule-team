import { Request, Response } from "express";
import { validateTelegramData } from "../utils/hash-util";
import { UserInfo } from "../entity/user.entity";
import { AppDataSource } from "../config";
import { generateToken } from "../utils/encrypt";

export const checkTelegramData = async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(UserInfo);
  const { initData, userInfo } = req.body;
  const { TELEGRAM_TOKEN, NODE_ENV } = process.env;

  const firstName = userInfo?.first_name || "";
  const lastName = userInfo?.last_name || "";
  const chatId = userInfo?.id || "";

  if (initData == undefined || !firstName || !lastName || !chatId) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    const isValidTelegramData =
      NODE_ENV === "dev"
        ? true
        : validateTelegramData(initData, TELEGRAM_TOKEN || "");
    if (isValidTelegramData) {
      const validUser = await userRepo.findOne({
        where: { chatId: chatId },
      });
      if (validUser) {
        const token = generateToken({
          id: validUser.id,
          role: "user",
        });
        console.log("Token1: ", token);
        return res.status(200).json({ message: "User authenticated.", token });
      } else {
        const user = new UserInfo();
        user.firstName = userInfo.first_name;
        user.lastName = userInfo.last_name;
        user.chatId = userInfo.id;
        user.email = "test@demo.com";
        user.phone = "85599";
        await userRepo.save(user);

        const token = generateToken({ id: user.id, role: "user" });
        console.log("Token: ", token);

        return res
          .status(200)
          .json({ message: "User created successfully", token });
      }
    } else {
      console.log("Invalid data");
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
