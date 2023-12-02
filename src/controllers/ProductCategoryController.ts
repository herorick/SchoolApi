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
    const { params, body, files } = req;
    const images = files as [Express.Multer.File];
    const imageNames = images.map((file) => file.filename);
    const { id } = params;
    const results = await ProductCategory.findByIdAndUpdate(
      id,
      { ...body, image: imageNames[0] },
      {
        new: true,
      }
    );
    res.json({ results });
  }
);

export const CreateProductCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { body, files } = req;
    const images = files as [Express.Multer.File];
    console.log({ images });
    const imageNames = images.map((file) => file.filename);

    const doc = new ProductCategory({ ...body, image: imageNames[0] });
    await doc.validate(); // Does not throw an error
    const results = await doc.save();

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

export const DeleteBlogCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedRecord = await ProductCategory.deleteMany();
    res.json(deletedRecord);
  }
);