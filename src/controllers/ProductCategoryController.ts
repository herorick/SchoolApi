import { NextFunction, Request, Response } from "express";
import { BlogCategory, ProductCategory } from "models";
import { Product } from "models/Product";
import { Vendor } from "models/Vendor";
import { NotFound } from "utilities";
import { asyncHandler } from "utilities/AsyncHandler";

export const GetProductCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await ProductCategory.find();
    return res.json({ result });
  } catch (err) {
    next(err);
  }
};

export const UpdateProductCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params, body } = req;
    const { id } = params;
    const result = await BlogCategory.findByIdAndUpdate(id, body, {
      new: true,
    });
    return res.json({ result });
  } catch (err) {
    next(err);
  }
};

export const CreateProductCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const result = await BlogCategory.create({ ...body, products: [] });
  return res.json({ result });
};

export const DeleteProductCategory = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {}
);

export const GetProductCategoryById = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {}
);
