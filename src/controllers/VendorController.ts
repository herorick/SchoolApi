import { Request, Response } from "express";
import {
  GenerateSalt,
  NotFound,
  Unauthorized,
  generatePassword,
  generateSignature,
  validatePassword,
} from "utilities";
import { removeImage } from "utilities/FileUntility";
import asyncHandler from "express-async-handler";
import { Vendor } from "models";

export const VendorGetAll = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor === null) {
      throw new NotFound("not found vendor with email: " + email);
    }
    const vendors = await Vendor.find({});
    res.json({ results: vendors });
  }
);

export const VendorLogin = asyncHandler(async (req: Request, res: Response) => {
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
  res.json({ message: "Login success", token: signature });
});

export const GetVendorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const existingVendor = await Vendor.findOne({ email: user.email })
      .populate("products")
      .exec();
    res.json(existingVendor);
  }
);

export const UpdateVendorProfile = asyncHandler(
  async (req: Request, res: Response) => {
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
  }
);

export const UpdateVendorCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const files = req.files as [Express.Multer.File];
    console.log({files})
    const existingVendor = await Vendor.findOne({ email: user.email });
    if (!existingVendor) {
      throw new NotFound("Vendor not found with email: " + user.email);
    }
    const images = files.map((file) => file.filename);
    await removeImage(existingVendor.coverImage);
    existingVendor.coverImage = images[0];
    const results = await existingVendor.save();
    res.json(results);
  }
);

export const UpdateVendorPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const { currentPassword, newPassword } = req.body;
    const existingVendor = await Vendor.findOne({ email: user.email });
    if (!existingVendor) {
      throw new NotFound("Vendor not found with email: " + user.email);
    }
    console.log({ existingVendor, currentPassword });
    const isValidPassword = await validatePassword(
      currentPassword,
      existingVendor.password,
      existingVendor.salt
    );
    if (!isValidPassword) {
      throw new Unauthorized("password is not correctly");
    }

    // generate a salt
    const salt = await GenerateSalt();

    // encrypt the password using salt
    const encryptedPassword = await generatePassword(newPassword, salt);
    existingVendor.password = encryptedPassword;
    existingVendor.salt = salt;
    const results = await existingVendor.save();
    res.json(results);
  }
);
