import { NextFunction, Request, Response } from "express";
import { Blog, BlogCategory } from "models";
import { Vendor } from "models/Vendor";
import asyncHandler from "express-async-handler";

export const CreateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const user = req.user!;
  const result = await Blog.create({
    title: body.title,
    tags: body.tags,
    content: body.content,
    author: user.id,
    blogCategory: body.categoryId,
  });
  await Promise.all([
    Vendor.findByIdAndUpdate(user.id, { $push: { blogs: result._id } }),
    BlogCategory.findByIdAndUpdate(body.categoryId, {
      $push: { blogs: result._id },
    }),
  ]);
  res.json({ result });
});

export const GetBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { params } = req;
  const { id } = params;
  const result = await Blog.findById(id)
    .populate("author")
    .populate("blogCategory")
    .exec();
  res.json({ result });
});

export const DeleteBlogById = asyncHandler(
  async (req: Request, res: Response) => {
    const { params } = req;
    const user = req.user!;
    const { id } = params;
    await Promise.all([
      Blog.findByIdAndDelete(id),
      Vendor.findByIdAndUpdate(user.id, {
        $pull: { blogs: id },
      }),
      BlogCategory.findByIdAndUpdate(user.id, {
        $pull: { blogs: id },
      }),
    ]);
    res.json({ status: "success" });
  }
);

export const GetAllBlog = asyncHandler(async (req: Request, res: Response) => {
  res.json(res.paginatedData);
});

export const UpdateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = req;
  const { id } = params;
  const result = await Blog.findByIdAndUpdate(id, body, { new: true });
  res.json({ result });
});
