import { NextFunction, Request, Response } from "express";
import { Product } from "models/Product";
import { Vendor } from "models/Vendor";
import { NotFound } from "utilities";
import { asyncHandler } from "utilities/AsyncHandler";

export const GetProducts = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    res.json(res.paginatedData);
  }
);

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

export const CreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, body, files } = req;
    const { name, description, price } = body;
    const vendor = await Vendor.findOne({ email: user?.email });
    if (!vendor) throw new NotFound("Vendor not found by email: " + user?.name);
    const images = files as [Express.Multer.File];
    const imageNames = images.map((file) => file.filename);
    const createdProduct = await Product.create({
      name,
      description,
      price,
      vendorId: user?.id,
      rating: 0,
      images: imageNames,
    });
    vendor.products.push(createdProduct);
    await vendor.save();
    return res.json({ product: createdProduct });
  } catch (err) {
    console.log({ err });
    next(err);
  }
};

export const UpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { id } = req.params;
  const { name, description, price } = req.body;
  const vendor = await Vendor.findOne({ email: user?.email });
  if (!vendor) throw new NotFound("Vendor not found by email: " + user?.name);
  const existingProduct = await Product.findById(id);
  if (!existingProduct) throw new NotFound("Product not found with id: " + id);
  existingProduct.name = name;
  existingProduct.price = price;
  existingProduct.description = description;
};

export const DeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.json({ message: "Remove is successfully" });
  } catch (err) {
    next(err);
  }
};
