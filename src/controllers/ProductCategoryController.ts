import { Request, Response } from "express";
import { Product, ProductCategory } from "models";
import asyncHandler from "express-async-handler";

export const GetProductCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await ProductCategory.find();
    res.json({ results });
  }
);

export const GetProductCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { params, body } = req;
    const { id } = params;
    const results = await ProductCategory.findById(id)
      .populate("products")
      .exec();
    res.json(results);
  }
);

export const UpdateProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { params, body } = req;
    const { id } = params;
    const results = await ProductCategory.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.json({ results });
  }
);

export const CreateProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req;
    const results = await ProductCategory.create({
      ...body,
    });
    res.json({ results });
  }
);

export const DeleteProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { params, body } = req;
    const { id } = params;
    const deletedRecord = await ProductCategory.findByIdAndDelete(id);
    const productIds = deletedRecord?.products || [];
    await ProductCategory.findByIdAndDelete(id);
    await Product.deleteMany({ _id: productIds });
    res.json(deletedRecord);
  }
);
