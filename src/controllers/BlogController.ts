import { Request, Response } from "express";
import { Blog, BlogCategory, Vendor } from "models";
import asyncHandler from "express-async-handler";

export const CreateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req;
  const user = req.user!;
  const results = await Blog.create({
    title: body.title,
    tags: body.tags,
    content: body.content,
    author: user.id,
    blogCategory: body.categoryId,
  });
  await Promise.all([
    Vendor.findByIdAndUpdate(user.id, { $push: { blogs: results._id } }),
    BlogCategory.findByIdAndUpdate(body.categoryId, {
      $push: { blogs: results._id },
    }),
  ]);
  res.json({ results });
});

export const GetBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { params } = req;
  const { id } = params;
  const results = await Blog.findById(id)
    .populate("author")
    .populate("blogCategory")
    .exec();
  res.json({ results });
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
  const data = await Blog.find().populate("blogCategoryId").exec()
  res.json(data)
  // res.json(res.paginatedData);
});

export const UpdateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = req;
  const { id } = params;
  const results = await Blog.findByIdAndUpdate(id, body, { new: true });
  res.json({ results });
});
