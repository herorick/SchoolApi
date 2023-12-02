import { Request, Response } from "express";
import { Blog, BlogCategory, Vendor } from "models";
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
    const results = await BlogCategory.create({
      title: body.title,
      description: body.description,
    });
    res.json({ results });
  }
);

export const GetBlogsByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { params } = req;
    const { id } = params;
    const results = await BlogCategory.findOne({ _id: id })
      .populate("blogs")
      .exec();
    res.json({ results });
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
    const results = await BlogCategory.findByIdAndUpdate(id, {
      title: body.title,
      description: body.description,
    });
    res.json({ results });
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

export const DeleteBlogCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedRecord = await BlogCategory.deleteMany();
    res.json(deletedRecord);
  }
);