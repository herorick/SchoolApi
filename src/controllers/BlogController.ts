import { NextFunction, Request, Response } from "express";
import { Blog, BlogCategory } from "models";
import { Vendor } from "models/Vendor";

export const CreateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    return res.json({ result });
  } catch (e) {
    next(e);
  }
};

export const GetBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params } = req;
    const { id } = params;
    const result = await Blog.findById(id)
      .populate("author")
      .populate("blogCategory")
      .exec();
    return res.json({ result });
  } catch (e) {
    next(e);
  }
};

export const DeleteBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    return res.json({ status: "success" });
  } catch (e) {
    next(e);
  }
};

export const GetAllBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json(res.paginatedData);
  } catch (e) {
    next(e);
  }
};

export const UpdateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params, body } = req;
    const { id } = params;
    const result = await Blog.findByIdAndUpdate(id, body, { new: true });
    return res.json({ result });
  } catch (err) {
    next(err);
  }
};
