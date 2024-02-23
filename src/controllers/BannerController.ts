import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Banner } from "../models/Banner";

export const GetBanners = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banners = await Banner.find({}).exec();
    res.json(banners);
  }
);

export const UpdateBanners = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const banners = await Banner.find({}).exec();
    const createdBanner = await Banner.create(req.body);
    res.json(createdBanner);
  }
);
