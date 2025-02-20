import { comparePassword, encryptPassword, generateToken } from '../utils/encrypt';
import { Request, response, Response } from "express";
import { UserInfo } from "../entity/user.entity";
import { AppDataSource } from '../config';
import { RoleEnum, RoleType } from '../common';
import { Coupon_User } from '../entity/coupon_user.entity';
import { generateCode } from '../utils/generate_code';
import { Coupon } from '../entity/coupon.entity';

export const register = async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(UserInfo);
  const couponuserRepo = AppDataSource.getRepository(Coupon_User);
  const couponRepo = AppDataSource.getTreeRepository(Coupon)
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(500).json({
      message: "something wrong",
    });
  }

  const validUser = await userRepo.findOne({ where: { userEmail: email } });
  if (validUser) {
    return res.status(400).json({
      message: "user already exist!",
    });
  }
  const id = '19ef43aa-bdc3-4686-a169-0806da5562e9';
  const couponRespone = await couponRepo.findOne({ where: { id: id } });
 

  const hashPassword = await encryptPassword(password);
  const user = new UserInfo();
  user.name = name;
  user.userEmail = email;
  user.password = hashPassword;

  const userRespone = await userRepo.save(user);

  const token = generateToken({ id: user.id, role: RoleEnum[2] });

  const couponuser = new Coupon_User();
  couponuser.coupon_code = `GYM-${generateCode(10)}`;
  couponuser.user = userRespone;
  couponuser.used = 0;
  if (couponRespone) {
    couponuser.coupon = couponRespone;
  } else {
    return res.status(500).json({ message: "Coupon not found" });
  }
  const couponuserRespone =  await couponuserRepo.save(couponuser);
    return res
    .status(200)
    .json({ message: "User created successfully" });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({
        message: "email and password are required",
      });
    }
    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOne({ where: { userEmail :email } });

    if (!user) {
      return res.status(400).json({
        _message: "User not found!",
        get message() {
          return this._message;
        },
        set message(value) {
          this._message = value;
        },
      });
    }

    const isPasswordValid = comparePassword(user.password, password);
    if (!user || !isPasswordValid) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken({ id: user.id, role: user.role as RoleType });
    return res.status(200).json({ message: "Login Successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};