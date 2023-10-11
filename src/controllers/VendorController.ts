import { NextFunction, Request, Response } from "express";
import { Vendor } from "models/Vendor";
import {
  NotFound,
  Unauthorized,
  generateSignature,
  validatePassword,
} from "utilities";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor === null) {
      throw new NotFound("not found vendor with email: " + email);
    }
    const isValidPassword = await validatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );
    if (!isValidPassword) {
      throw new Unauthorized("password is not correctly");
    }
    const signature = generateSignature({
      id: existingVendor._id,
      email: existingVendor.email,
      name: existingVendor.name,
    });
    return res.json({ message: "Login success", token: signature });
  } catch (err) {
    next(err);
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  console.log({ user });
  const existingVendor = await Vendor.findOne({ email: user.email });
  return res.json(existingVendor);
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address, phone } = req.body;
    const user = req.user!;
    const existingVendor = await Vendor.findOne({ email: user.email });
    if (!existingVendor) {
      throw new NotFound("Vendor not found with email: " + user.email);
    }
    existingVendor.name = name;
    existingVendor.address = address;
    existingVendor.phone = phone;
    const savedResult = await existingVendor.save();
    res.json(savedResult);
  } catch (err) {
    next(err);
  }
};

