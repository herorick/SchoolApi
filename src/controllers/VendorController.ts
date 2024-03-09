import { NextFunction, Request, Response } from "express";
import {
  APIError,
  GenerateSalt,
  NotFound,
  Unauthorized,
  generatePassword,
  generateSignature,
  validatePassword,
} from "../utilities";
import { removeImage } from "../utilities/FileUntility";
import asyncHandler from "express-async-handler";
import {
  Order,
  OrderDoc,
  Product,
  ProductDoc,
  Vendor,
  orderStatusEnums,
} from "../models";
import { Offer } from "../models/Offer";
import { VendorService } from "../services/VendorService";
import { CreateOfferInputs } from "../dtos/Offer";
import { Transaction, TransactionDoc } from "../models/Transaction";
import { PaginatedData } from "../middlewares/PaginationMiddleware";

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

export const RemoveVendors = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Vendor.deleteMany();
    res.json(results);
  }
);

// Order
export const GetVendorOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginatedData<OrderDoc> = {
      results: [],
    };
    try {
      // Count the total number of documents in the collection
      const totalDocuments = await Order.countDocuments({
        vendorId: user.id,
      }).exec();

      if (startIndex > 0) {
        results.hasPrevious = true;
      }

      if (endIndex < totalDocuments) {
        results.hasNext = true;
      }

      results.totalPage = Math.ceil(totalDocuments / limit);

      results.page = page;

      // Query the database for paginated results
      results.results = await Order.find({ vendorId: user.id })
        .populate("customerId")
        .skip(startIndex)
        .limit(limit)
        .exec();

      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      throw new APIError("some thing error");
    }
  }
);

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.product");
    if (order != null) {
      return res.status(200).json(order);
    }
  }

  return res.json({ message: "Order Not found" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const { status, remarks } = req.body;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.product")!;
    if (order === null) throw new NotFound("");
    order.status = status;
    order.remarks = remarks;
    const orderResult = await order.save();
    if (orderResult != null) {
      return res.status(200).json(orderResult);
    }
  }
  return res.json({ message: "Unable to process order" });
};

export const RejectOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId)!;
    if (order === null) throw new NotFound("");
    order.status = orderStatusEnums.cancelled;
    const orderResult = await order.save();
    if (orderResult != null) {
      return res.status(200).json(orderResult);
    }
  }
  return res.json({ message: "Unable to process order" });
};

// End Order

// Offers
export const GetOffers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    let currentOffer = Array();
    const offers = await Offer.find().populate("vendors");
    if (offers) {
      offers.map((item) => {
        if (item.vendors) {
          item.vendors.map((vendor) => {
            if (vendor._id.toString() === user.id) {
              currentOffer.push(item);
            }
          });
        }
        if (item.offerType === "GENERIC") {
          currentOffer.push(item);
        }
      });
    }
    res.status(200).json(currentOffer);
  } catch (err) {
    throw new APIError();
  }
});

export const GetOfferDetail = asyncHandler(
  async (req: Request, res: Response) => {
    try {
    } catch (err) {
      throw new APIError();
    }
  }
);

export const AddOffer = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const {
      status,
      title,
      description,
      offerType,
      offerAmount,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      minValue,
      isActive,
      numberOfTimes,
      isUnlimited,
    } = <CreateOfferInputs>req.body;
    const vendor = await VendorService.GetVendorById(user.id);
    console.log({ vendor, userId: user.id });
    if (!vendor) throw new NotFound("vendor not found by id: " + user.id);
    const offer = await Offer.create({
      promoCode,
      title,
      description,
      offerType,
      offerAmount,
      promoType,
      startValidity,
      endValidity,
      isActive,
      minValue,
      vendors: [vendor],
      isUnlimited,
      numberOfTimes,
      draft: "draft",
      status,
    });
    res.status(200).json(offer);
  } catch (err) {
    throw new APIError("Unable to add Offer!");
  }
});

export const GetOffer = asyncHandler(async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    const offer = await Offer.findById(offerId);
    res.status(200).json({ data: offer });
  } catch (err) {
    throw new APIError("Unable to edit Offer!");
  }
});

export const EditOffer = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const offerId = req.params.id;
    const {
      title,
      description,
      offerType,
      offerAmount,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      minValue,
      isActive,
    } = <CreateOfferInputs>req.body;
    const currentOffer = await Offer.findById(offerId);
    const vendor = await VendorService.GetVendorById(user.id);
    if (!currentOffer)
      throw new NotFound("Not found offer with id: " + offerId);
    if (!vendor) throw new NotFound("Not found offer with id: " + user.id);

    currentOffer.title = title;
    currentOffer.promoCode = promoCode;
    currentOffer.description = description;
    currentOffer.offerType = offerType;
    currentOffer.offerAmount = offerAmount;
    currentOffer.promoType = promoType;
    currentOffer.startValidity = startValidity;
    currentOffer.endValidity = endValidity;
    currentOffer.isActive = isActive;
    currentOffer.minValue = minValue;
    const result = await currentOffer.save();
    res.status(200).json(result);
  } catch (err) {
    throw new APIError("Unable to edit Offer!");
  }
});

export const DeleteOffer = asyncHandler(async (req: Request, res: Response) => {
  try {
    const offerId = req.params.id;
    const offer = await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ data: offer });
  } catch (err) {
    throw new APIError();
  }
});

// End Offers

// Transaction
export const GetTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results: PaginatedData<TransactionDoc> = {
        results: [],
      }; // Count the total number of documents in the collection
      const totalDocuments = await Transaction.countDocuments({
        vendorId: user.id,
      }).exec();

      if (startIndex > 0) {
        results.hasPrevious = true;
      }

      if (endIndex < totalDocuments) {
        results.hasNext = true;
      }

      results.totalPage = Math.ceil(totalDocuments / limit);

      results.page = page;

      // Query the database for paginated results
      results.results = await Transaction.find({ vendorId: user.id })
        .skip(startIndex)
        .limit(limit)
        .populate("vendor")
        .populate("order")
        .populate("customer")
        .exec();

      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      throw new APIError("can't get transaction");
    }
  }
);

// End Transaction

export const GetVendorProducts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results: PaginatedData<ProductDoc> = {
        results: [],
      }; // Count the total number of documents in the collection
      const totalDocuments = await Product.countDocuments({
        vendor: user.id,
      }).exec();

      if (startIndex > 0) {
        results.hasPrevious = true;
      }

      if (endIndex < totalDocuments) {
        results.hasNext = true;
      }

      results.totalPage = Math.ceil(totalDocuments / limit);

      results.page = page;

      // Query the database for paginated results
      results.results = await Product.find({ vendor: user.id })
        .skip(startIndex)
        .limit(limit)
        .populate("brand")
        .populate("productCategories")
        .exec();

      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      throw new APIError("can't get transaction");
    }
  }
);
