import { Request, Response } from "express";
import { Coupon } from "models";
import asyncHandler from "express-async-handler";

export const CreateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await Coupon.create({
      ...req.body,
    });
    res.json({ result });
  }
);

export const UpdateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await Coupon.create({
      ...req.body,
    });
    res.json({ result });
  }
);

export const RemoveCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await Coupon.findByIdAndDelete(id);
    res.json({ result });
  }
);

export const GetAllCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await Coupon.find();
    res.json({ result });
  }
);

export const GetCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await Coupon.findById(id);
    res.json({ result });
  }
);
