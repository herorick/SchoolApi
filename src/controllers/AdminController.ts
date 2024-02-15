import { Transaction } from "@/models/Transaction";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Vendor } from "models";
import { Conflict, GenerateSalt, NotFound, generatePassword } from "utilities";

export const CreateVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { body, files } = req;
    const { name, address, email, password, phone, isAdmin = false } = body;

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
      blogs: [],
      isAdmin
    });

    res.json(createdVendor);
  }
);

export const GetVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find({}).exec();
    res.json(vendors);
  }
);

export const UpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { };

export const GetVendorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (vendor === null) {
      throw new NotFound("vendor is not found with id: " + vendorId);
    }
    res.json(vendor);
  }
);

export const DeleteVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { };

export const DeleteAllVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await Vendor.deleteMany({});
    res.json({ message: "remove successfully" });
  }
);

// transactions
export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const transactions = await Transaction.find({});
  if (transactions) {
    return res.status(200).json(transactions)
  }
  return res.json({ "message": "Transactions data not available" })
}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const transaction = await Transaction.findById(id);
  if (transaction) {
    return res.status(200).json(transaction)
  }
  return res.json({ "message": "Transaction data not available" })
}
// end transactions
