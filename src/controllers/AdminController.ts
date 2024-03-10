import { Transaction } from "../models/Transaction";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { DeliveryUser, Vendor } from "../models";
import {
  Conflict,
  GenerateSalt,
  NotFound,
  generatePassword,
} from "../utilities";

export const CreateVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { body, files } = req;
    const {
      name,
      address,
      email,
      password,
      phone,
      isAdmin = false,
      description,
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
      blogs: [],
      isAdmin,
      description,
    });

    res.json(createdVendor);
  }
);

export const GetVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json(res.paginatedData);
  }
);

export const AdminUpdateVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const { body } = req;
    const result = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        description: body.description,
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
      },
      {
        new: true,
      }
    );
    res.json({ data: result });
  }
);

export const AdminActiveVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const result = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        status: "Active",
      },
      {
        new: true,
      }
    );
    res.json({ data: result });
  }
);

export const AdminInActiveVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const result = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        status: "Inactive",
      },
      {
        new: true,
      }
    );
    res.json({ data: result });
  }
);

export const GetVendorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);
    if (vendor === null) {
      throw new NotFound("vendor is not found with id: " + vendorId);
    }
    res.json({ data: vendor });
  }
);

export const DeleteVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const DeleteAllVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await Vendor.deleteMany({});
    res.json({ message: "remove successfully" });
  }
);

// transactions
export const AdminGetTransactions = async (req: Request, res: Response) => {
  const transactions = await Transaction.find({});
  if (transactions) {
    return res.status(200).json(transactions);
  }
  return res.json({ message: "Transactions data not available" });
};

export const GetTransactionById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const transaction = await Transaction.findById(id);
  if (transaction) {
    return res.status(200).json(transaction);
  }
  return res.json({ message: "Transaction data not available" });
};
// end transactions

// delivery
export const VerifyDeliveryUser = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  if (id) {
    const profile = await DeliveryUser.findById(id);
    if (profile) {
      profile.verified = status;
      const result = await profile.save();
      return res.status(200).json(result);
    }
  }
  return res.json({ message: "Unable to verify Delivery User" });
};

export const AdminGetDeliveryUsers = asyncHandler(
  async (req: Request, res: Response) => {
    res.json(res.paginatedData);
  }
);
// end delivery
