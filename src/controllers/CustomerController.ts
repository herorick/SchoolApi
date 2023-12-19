import { Request, Response } from "express";
import { Coupon, Customer } from "models";
import asyncHandler from "express-async-handler";
import {
  Conflict,
  GenerateSalt,
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
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const CustomerRequestOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const CustomerGetProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);

export const CustomerEditProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Coupon.create({
      ...req.body,
    });
    res.json({ results });
  }
);
