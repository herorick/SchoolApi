import { Request, Response } from "express";
import { Blog, BlogCategory } from "models";
import { Vendor } from "models/Vendor";
import { NotFound } from "utilities";
import asyncHandler from "express-async-handler";

export const GetCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await BlogCategory.find({});
    res.json({ categories: categories });
  }
);

export const CreateBlogCategory = asyncHandler(
  async (req: Request, res: Response) => {
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
    res.json({ result });
  }
);

export const GetBlogsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { params } = req;
    const { id } = params;
    const result = await BlogCategory.findOne({ _id: id })
      .populate("blogs")
      .exec();
    res.json({ result });
  }
);

export const UpdateBlogCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { body, params } = req;
    const { id } = params;
    const user = req.user!;
    const existingVendor = await Vendor.findOne({ email: user.email });
    if (!existingVendor) {
      throw new NotFound("Vendor not found with email: " + user.email);
    }
    const result = await BlogCategory.findByIdAndUpdate(id, {
      title: body.title,
      description: body.description,
    });
    res.json({ result });
  }
);

export const DeleteBlogCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { params } = req;
    const { id } = params;
    const deletedRecord = await BlogCategory.findByIdAndDelete(id);
    const blogs = deletedRecord?.blogs || [];
    await Blog.deleteMany(blogs);
    res.json(deletedRecord);
  }
);
