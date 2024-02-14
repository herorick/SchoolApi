import { Request, Response } from "express";
import { Coupon, Customer, Order } from "models";
import asyncHandler from "express-async-handler";
import {
  APIError,
  Conflict,
  GenerateSalt,
  NotFound,
  Unauthorized,
  generatePassword,
  generateSignature,
  validatePassword,
} from "utilities";
import { GenerateOtp, onRequestOTP } from "utilities/NotificationUtility";
import { ICartItem } from "interfaces/Cart";
import { OrderService } from "services";
import { CartService } from "@/services/CartService";
import { ICreateOrder } from "@/interfaces/Order";

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
      orders: []
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
    try {
      const { email, password } = req.body;
      const customer = await Customer.findOne({ email: email });
      if (customer) {
        const validation = await validatePassword(password, customer.password, customer.salt);
        if (!validation) throw new Unauthorized();
        const signature = generateSignature({
          id: customer._id,
          email: customer.email,
          verified: customer.verified
        })
        res.status(200).json({
          signature,
          email: customer.email,
          verified: customer.verified
        })
      }
    } catch (err) {
      res.status(404).json("some thing wrong")
    }
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
    const profile = await Customer.findById(customer.id).populate("orders");
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
  const profile = req.profile!;
  res.status(200).json(profile.cart);
});

export const DeleteCart = asyncHandler(async (req: Request, res: Response) => {
  const profile = req.profile!;
  const cartResult = await CartService.deleteCart(profile);
  res.status(200).json(cartResult);
});

export const AddToCart = asyncHandler(async (req: Request, res: Response) => {
  const profile = req.profile!;
  const cartItem = req.body as ICartItem;
  const cartResult = await CartService.addToCart(cartItem, profile);
  res.status(200).json(cartResult.cart);
});

// Order
export const GetOrders = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user!;
  const profile = await OrderService.getOrdersByCustomer(customer.id);
  res.status(200).json(profile.orders);
});

export const GetOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await OrderService.getOrderById(orderId);
    res.status(200).json({
      results: order,
    });
  }
);

export const CreateOrder = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user!;
  const profile = await OrderService.getOrdersByCustomer(customer.id);
  const { txnId, amount, items } = req.body as ICreateOrder;
  try {
    const response = OrderService.createOrder(items, txnId, amount, profile)
    res.status(201).json(response)
  } catch (err) {
    console.log(err)
    throw new Error("Some thing was wrong!!!");
  }
});
