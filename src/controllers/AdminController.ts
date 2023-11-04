import { Request, Response, NextFunction } from "express";
import { Vendor } from "models";
import {
  Conflict,
  GenerateSalt,
  NotFound,
  generatePassword,
} from "utilities";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, files } = req;
    console.log({req})
    const {
      name,
      address,
      email,
      password,
      phone,
    } = body;

    const images = files as [Express.Multer.File];
    const imageNames = images.map((file) => file.filename);

    const existingVendor = await Vendor.findOne({ email });

    if (existingVendor !== null) {
      throw new Conflict("vendor is exist with email: " + email);
    }

    // generate a salt
    const salt = await GenerateSalt();

    // encrypt the password using salt
    const encryptedPassword = await generatePassword(password, salt);

    const createdVendor = await Vendor.create({
      name,
      address,
      email,
      password: encryptedPassword,
      salt: salt,
      phone,
      rating: 0,
      coverImage: imageNames[0],
      products: [],
      blogs: []
    });

    return res.json(createdVendor);
  } catch (err) {
    next(err);
  }
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vendor.find({}).exec();
    return res.json(vendors);
  } catch (err) {
    next(err);
  }
};

export const UpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (vendor === null) {
      throw new NotFound("vendor is not found with id: " + vendorId);
    }
    return res.json(vendor);
  } catch (err) {
    next(err);
  }
};

export const DeleteVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const DeleteAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Vendor.deleteMany({});
    return res.json({ message: "remove successfully" });
  } catch (err) {
    next(err);
  }
};
