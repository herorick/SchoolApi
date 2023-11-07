import { Request, Response } from "express";
import { Brand, Product } from "models";
import asyncHandler from "express-async-handler";

export const CreateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body;
  const result = await Brand.create({
    title,
    products: [],
  });
  res.json({ result });
});

export const UpdateBrand = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = req;
  const { id } = params;
  const { title } = body;
  const updatedRecord = await Brand.findByIdAndUpdate(id, { title });
  res.json({ result: updatedRecord });
});

export const DeleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { params } = req;
  const { id } = params;
  const removedRecord = await Brand.findByIdAndRemove(id);
  const products = removedRecord?.products || [];
  await Product.updateMany(
    { _id: products },
    { $pull: { brand: id } }
  );
  res.json({ result: removedRecord });
});

export const GetAllBrand = asyncHandler(async (req: Request, res: Response) => {
  const result = await Brand.find();
  res.json({ result });
});

export const GetBrand = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = req;
  const { id } = params;
  const result = await Brand.findById(id);
  res.json({ result });
});
