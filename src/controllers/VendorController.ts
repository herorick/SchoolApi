import { NextFunction, Request, Response } from "express";
import {
  APIError,
  GenerateSalt,
  NotFound,
  Unauthorized,
  generatePassword,
  generateSignature,
  validatePassword,
} from "utilities";
import { removeImage } from "utilities/FileUntility";
import asyncHandler from "express-async-handler";
import { Customer, Order, Vendor } from "models";
import { OrderService } from "@/services";

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

export const RemoveVendors = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Vendor.deleteMany();
    res.json(results);
  }
);

// Order
export const GetVendorOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user.id }).populate('items.product');
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.json({ message: 'Orders Not found' });
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate('items.food');
    if (order != null) {
      return res.status(200).json(order);
    }
  }

  return res.json({ message: 'Order Not found' });
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;
  const { status, remarks } = req.body;
  if (orderId) {
    const order = await Order.findById(orderId).populate('items.product')!;
    if (order === null) throw new NotFound("");
    order.status = status;
    order.remarks = remarks;
    const orderResult = await order.save();
    if (orderResult != null) {
      return res.status(200).json(orderResult);
    }
  }
  return res.json({ message: 'Unable to process order' });
}


// Offers
export const GetOffers = asyncHandler(async (req: Request, res: Response,) => {
  try {
    const user = req.user;
    if (!user) throw new Unauthorized("Not have permission");
    let currentOffer = Array();
    // get all vendor

  } catch (err) {
    throw new APIError()
  }
});

export const GetOfferDetail = asyncHandler(async (req: Request, res: Response,) => {
  try {
    const orderId = req.params.id;
    if (!orderId) throw new NotFound('Order Not found')
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (err) {
    throw new APIError()
  }
});

export const AddOffer = asyncHandler(async (req: Request, res: Response) => {
})

export const EditOffer = asyncHandler(async (req: Request, res: Response) => {
  try {

  } catch (err) {
    throw new APIError()
  }
})