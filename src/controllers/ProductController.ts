import { NextFunction, Request, Response } from "express";
import { Product } from "models/Product";
import { Vendor } from "models/Vendor";
import { NotFound } from "utilities";

export const GetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    return res.json({ products });
  } catch (err) {
    next(err);
  }
};

export const GetProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.json({ product });
  } catch (err) {
    next(err);
  }
};

export const AddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { name, description, category, price } = req.body;
    const vendor = await Vendor.findOne({ email: user?.email });
    if (!vendor) throw new NotFound("Vendor not found by email: " + user?.name);
    const createdProduct = await Product.create({
      name,
      description,
      category,
      price,
      vendorId: user?.id,
    });
    vendor.products.push(createdProduct);
    const result = await vendor.save();
    return res.json({ product: result });
  } catch (err) {
    next(err);
  }
};

export const UpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const DeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
