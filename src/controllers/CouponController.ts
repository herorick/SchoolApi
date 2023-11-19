import { Request, Response } from "express";
import { Coupon } from "models";
import asyncHandler from "express-async-handler";

export const CreateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const UpdateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const RemoveCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const results = await Coupon.findByIdAndDelete(id);
    res.json({ results });
  }
);

export const GetAllCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.find();
    res.json({ results });
  }
);

export const GetCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const results = await Coupon.findById(id);
    res.json({ results });
  }
);
