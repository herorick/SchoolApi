import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const ValidateObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    next();
  } else {
    return res.status(400).json({ message: "Invalid Id" });
  }
};
