import { NextFunction, Request, Response } from "express";
import { Blog, BlogCategory } from "models";
import { Vendor } from "models/Vendor";
import { NotFound } from "utilities";

export const GetCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categories = await BlogCategory.find({});
  return res.json({ categories: categories });
};

export const CreateBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const user = req.user!;
  const existingVendor = await Vendor.findOne({ email: user.email });
  if (!existingVendor) {
    throw new NotFound("Vendor not found with email: " + user.email);
  }
  const result = await BlogCategory.create({
    title: body.title,
    description: body.description,
  });

  return res.json({ result });
};

export const GetBlogsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params } = req;
  const { id } = params;
  const result = await BlogCategory.findOne({ _id: id })
    .populate("blogs")
    .exec();
  return res.json({ result });
};

export const UpdateBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, params } = req;
  console.log({body})
  const { id } = params;
  const user = req.user!;
  const existingVendor = await Vendor.findOne({ email: user.email });
  if (!existingVendor) {
    throw new NotFound("Vendor not found with email: " + user.email);
  }
  const result = await BlogCategory.findByIdAndUpdate(
    id,
    { title: body.title, description: body.description }
  );
  return res.json({ result });
};

export const DeleteBlogCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, files } = req;
  const user = req.user!;
  const existingVendor = await Vendor.findOne({ email: user.email });
  if (!existingVendor) {
    throw new NotFound("Vendor not found with email: " + user.email);
  }
  existingVendor.blogs = [...existingVendor.blogs, body];
  const result = await existingVendor.save();
  const createdProduct = await Blog.create({});
};
