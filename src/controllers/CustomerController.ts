import { NextFunction, Request, Response } from "express";
import { Coupon, Customer } from "models";
import asyncHandler from "express-async-handler";
import {
  Conflict,
  GenerateSalt,
  NotFound,
  Unauthorized,
  generatePassword,
  generateSignature,
} from "utilities";
import { GenerateOtp, onRequestOTP } from "utilities/NotificationUtility";

export const CustomerSignUp = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req;

    const { email, phone, password, firstName, lastName } = body;

    const salt = await GenerateSalt();
    const userPassword = await generatePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const existCustomer = await Customer.findOne({ email });

    if (existCustomer) throw new Conflict("user has already exist");

    const result = await Customer.create({
      email,
      phone,
      otp,
      salt,
      password: userPassword,
      otp_expiry: expiry,
      firstName,
      lastName,
      verified: false,
      lat: 0,
      wishlist: [],
      cart: [],
      address: [],
    });

    if (result) {
      // Send the OTP to customer
      await onRequestOTP(otp, phone);
      // generate the signature
      const signature = generateSignature({
        id: result.id,
        email: result.email,
        verified: result.verified,
      });
      // send the result to client

      res.json({ signature, verified: result.verified, email: result.email });
    }
  }
);

export const CustomerSignIn = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const CustomerVerify = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp } = req.body;
    const customer = req.user;
    if (!customer) {
      throw new NotFound("please check token");
    }
    const profile = await Customer.findById(customer.id);
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }
    if (profile.otp !== Number(otp) || profile.otp_expiry > new Date()) {
      new Unauthorized("Token is expired");
    }

    profile.verified = true;
    const updateProfile = await profile.save();
    const signature = generateSignature({
      id: updateProfile.id,
      email: updateProfile.email,
      verified: updateProfile.verified,
    });

    res.status(200).json({
      signature,
      email: updateProfile.email,
      verified: updateProfile.verified,
    });
  }
);

export const CustomerRequestOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = req.user;

    if (!customer) {
      throw new NotFound("please check token");
    }
    const profile = await Customer.findById(customer.id);
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }

    const { otp, expiry } = GenerateOtp();
    profile.otp = otp;
    profile.otp_expiry = expiry;

    await profile.save();
    const sendCode = await onRequestOTP(otp, profile.phone);

    if (!sendCode) {
      res.status(400).json({ message: "Failed to verify your phone number" });
    }

    res
      .status(200)
      .json({ message: "OTP sent to your registered Mobile Number!" });
  }
);

export const CustomerGetProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = req.user;
    if (!customer) {
      throw new NotFound("please check token");
    }
    const profile = await Customer.findById(customer.id);
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }
    res.status(201).json({ results: profile });
  }
);

export const CustomerEditProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = req.user;
    const { body } = req;
    if (!customer) {
      throw new NotFound("please check token");
    }
    const results = await Customer.findByIdAndUpdate(
      customer.id,
      { ...body },
      {
        new: true,
      }
    );
    res.status(201).json({ results });
  }
);

export const GetCart = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) {
    throw new NotFound("please check token");
  }
  const profile = await Customer.findById(customer.id);
  if (!profile) {
    throw new NotFound("customer not found by id" + customer.id);
  }
  res.status(200).json(profile.cart);
});

export const DeleteCart = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user;
  if (!customer) {
    throw new NotFound("please check token");
  }
  const profile = await Customer.findById(customer.id)
    .populate("cart.product")
    .exec();
  if (!profile) {
    throw new NotFound("customer not found by id" + customer.id);
  }
  profile.cart = [] as any;
  const cartResult = await profile.save();

  res.status(200).json(cartResult);
});

// Order
export const GetOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
    if (!customer) {
      throw new NotFound("please check token");
    }

    const profile = await Customer.findById(customer.id).populate("orders");
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }
    res.status(200).json(profile.orders);
  }
);

export const GetOrderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const customer = req.user;
    if (!customer) {
      throw new NotFound("please check token");
    }
    if (!orderId) {
      throw new NotFound("order detail not found by id" + customer.id);
    }
    const profile = await Customer.findById(customer.id).populate("orders");
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }
    const order = await Customer.findById(orderId).populate("items.product");
    if (!order) {
      throw new NotFound("order not found by id" + orderId);
    }
    res.status(200).json(order);
  }
);
