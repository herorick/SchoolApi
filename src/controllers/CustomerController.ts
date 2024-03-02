import { Request, Response } from "express";
import { Customer, DeliveryUser, Order } from "../models";
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
} from "../utilities";
import { GenerateOtp, onRequestOTP } from "../utilities/NotificationUtility";
import { ICartItem } from "../interfaces/Cart";
import { CustomerService, OrderService } from "../services";
import { CartService } from "../services/CartService";
import { ICreateOrder } from "../interfaces/Order";
import { Offer } from "../models/Offer";
import { Transaction } from "../models/Transaction";
import { validationResult } from "express-validator";

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
      orders: [],
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const customer = await Customer.findOne({ email: email });
      if (customer) {
        const validation = await validatePassword(
          password,
          customer.password,
          customer.salt
        );
        if (!validation) throw new Unauthorized();
        const signature = generateSignature({
          id: customer._id,
          email: customer.email,
          verified: customer.verified,
        });
        res.status(200).json({
          signature,
          email: customer.email,
          verified: customer.verified,
        });
      } else {
        res.status(400).json("Wrong email or password");
      }
    } catch (err) {
      res.status(404).json("some thing wrong");
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
    res.status(201).json({ data: profile });
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
    res.status(201).json({ data: results });
  }
);

export const GetCart = asyncHandler(async (req: Request, res: Response) => {
  const profile = req.profile!;
  const result = await Customer.findById(profile.id!)
    .populate("cart.product")
    .exec();
  res.status(200).json({ data: result?.cart || [] });
});

export const ClearCart = asyncHandler(async (req: Request, res: Response) => {
  const profile = req.profile!;
  const result = await Customer.findById(profile.id!).exec();
  if (result) {
    result.cart = [];
    await result.save();
    res.status(200).json({ data: result });
  }
});

export const AddToCart = asyncHandler(async (req: Request, res: Response) => {
  const profile = req.profile!;
  const cartItem = req.body as ICartItem;
  const cartResult = await CartService.addToCart(cartItem, profile);
  res.status(200).json(cartResult.cart);
});

export const UpdateQuantityCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = req.profile!;
    const { product: productId, unit } = req.body as ICartItem;
    const result = await Customer.findById(profile.id!).exec();
    if (!!result) {
      result.cart = (result?.cart || []).map((cart) => {
        if (cart.product.toString() === productId) {
          cart.unit = unit;
          return cart;
        }
        return cart;
      });
      await result.save();
    }
    res.status(200).json({ data: await result?.populate("cart.product") });
  }
);

export const DeleteCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = req.profile!;
    const productIds = req.body.productIds as any[];
    const result = await Customer.findById(profile.id!).exec();
    if (!!result) {
      result.cart = (result.cart || []).filter(
        (cart) => !productIds.includes(cart.product.toString())
      );
      await result.save();
    }
    res.status(200).json({ data: await result?.populate("cart.product") });
  }
);

// Order
export const GetOrders = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user!;
  const orders = await CustomerService.getOrders(customer.id);
  res.status(200).json({ data: orders });
});

export const GetOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("items.product");
    res.status(200).json({
      results: order,
    });
  }
);

export const CreateOrder = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user!;
  const profile = await CustomerService.GetCustomerById(customer.id);
  const { txnId, amount, items, deliveryId } = req.body as ICreateOrder;
  try {
    const response = await OrderService.createOrder(
      items,
      txnId,
      amount,
      deliveryId,
      profile
    );
    res.status(201).json(response);
  } catch (err) {
    res.json({ error: err });
  }
});

export const VerifyOffer = asyncHandler(async (req: Request, res: Response) => {
  const offerId = req.params.id;
  const appliedOffer = await Offer.findById(offerId);
  if (appliedOffer) {
    if (appliedOffer.isActive) {
      res.status(200).json({ message: "Offer is Valid", offer: appliedOffer });
    }
  }

  res.status(400).json({ msg: "Offer is Not Valid" });
});

export const CreatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const customer = req.user!;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer?.isActive) {
      payableAmount = payableAmount - appliedOffer.offerAmount;
    }
    // perform payment gateway charge api

    // create record on transaction
    const transaction = await Transaction.create({
      customer: customer.id,
      orderValue: payableAmount,
      offerUsed: offerId || "NA",
      status: "OPEN",
      paymentMode,
      paymentResponse: "Payment is cash on Delivery",
    });

    res.status(200).json({ data: transaction });
  }
);

// start delivery
export const CustomerGetDeliveryUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryUsers = await DeliveryUser.find({
      isAvailable: true,
      verified: true,
    });
    if (deliveryUsers) {
      res.status(200).json(deliveryUsers);
    }
    res.json({ message: "Unable to get Delivery Users" });
  }
);
// end delivery

// wishlist
export const CustomerGetWishList = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const customer = await Customer.findById(user.id).populate("wishlist");
      if (customer !== null) {
        res.json({ results: customer.wishlist });
      }
    } catch (err) {
      throw new APIError("can't add wishlist");
    }
  }
);

export const CustomerAddWishList = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { productId } = req.body;
      const customer = await Customer.findById(user.id)!;
      if (customer !== null) {
        const wishList = customer?.wishlist || [];
        customer.wishlist = [...wishList, productId];
        const result = await customer.save();
        res.json({ data: result });
      }
    } catch (err) {
      throw new APIError("can't add wishlisth");
    }
  }
);

export const CustomerRemoveWishList = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { productId } = req.body;
      const customer = await Customer.findById(user.id)!;
      if (customer !== null) {
        const wishList = customer?.wishlist || [];
        console.log({ wishList, productId });
        customer.wishlist = wishList.filter(
          (item) => item.toString() !== productId
        );
        const result = await customer.save();
        res.json({ result });
      }
    } catch (err) {
      throw new APIError("can't add wishlisth");
    }
  }
);
// end wishlist

// setting
export const CustomerUpdateSetting = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { setting } = req.body;
      const customer = await Customer.findById(user.id)!;
      if (customer !== null) {
        customer.setting = {
          ...customer.setting,
          ...setting,
        };
        const result = await customer.save();
        res.json({ result });
      }
    } catch (err) {
      throw new APIError("can't add wishlisth");
    }
  }
);
// end setting

// favorite vendor
export const CustomerAddFavoriteVendor = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { vendorId } = req.body;
      const customer = await Customer.findById(user.id);
      if (customer !== null) {
        customer.favoriteVendor = [...customer.favoriteVendor, vendorId];
        const result = await customer.save();
        res.json({ result });
      }
    } catch (err) {
      throw new APIError("can't add wishlisth");
    }
  }
);

export const CustomerRemoveFavoriteVendor = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { vendorId } = req.body;
      const customer = await Customer.findById(user.id)!;
      if (customer !== null) {
        customer.favoriteVendor = customer.favoriteVendor.filter(
          (item) => item.toString() !== vendorId
        );
        const result = await customer.save();
        res.json({ result });
      }
    } catch (err) {
      throw new APIError("can't add wishlisth");
    }
  }
);
