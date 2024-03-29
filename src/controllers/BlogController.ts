import { Request, Response } from "express";
import { Blog, BlogCategory, Vendor } from "../models";
import asyncHandler from "express-async-handler";
import { removeImages } from "../utilities/FileUntility";

export const CreateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { body, files } = req;
  const images = files as [Express.Multer.File];
  const imageNames = images.map((file) => file.filename);

  const user = req.user!;
  const results = await Blog.create({
    title: body.title,
    tags: body.tags,
    content: body.content,
    author: user.id,
    blogCategorys: body.blogCategorys,
    images: imageNames,
  });
  await Promise.all([
    Vendor.findByIdAndUpdate(user.id, { $push: { blogs: results._id } }),
  ]);
  body.blogCategorys.forEach((categoryId: any) => {
    BlogCategory.findByIdAndUpdate(categoryId, {
      $push: { blogs: results._id },
    });
  });
  res.json({ results });
});

export const GetBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { params } = req;
  const { id } = params;
  const results = await Blog.findById(id)
    .populate("author")
    .populate("blogCategorys")
    .exec();
  res.json({ data: results });
});

export const DeleteBlogById = asyncHandler(
  async (req: Request, res: Response) => {
    const { params } = req;
    const user = req.user!;
    const { id } = params;
    const [blog] = await Promise.all([
      Blog.findByIdAndDelete(id),
      Vendor.findByIdAndUpdate(user.id, {
        $pull: { blogs: id },
      }),
      BlogCategory.findByIdAndUpdate(user.id, {
        $pull: { blogs: id },
      }),
    ]);
    if (blog !== null) {
      removeImages(blog.images);
    }
    res.json({ status: "success" });
  }
);

export const GetAllBlog = asyncHandler(async (req: Request, res: Response) => {
  const data = await Blog.find({})
    .populate("blogCategorys")
    .populate("author")
    .sort({ createdAt: "desc" })
    .exec();
  res.json({ results: data });
  // res.json(res.paginatedData);
});

export const GetAllBlogByTag = asyncHandler(
  async (req: Request, res: Response) => {
    const { params, query } = req;
    const { search } = query;
    const data = await Blog.find({ tags: { $in: [search] } })
      .populate("blogCategorys")
      .populate("author")
      .exec();
    res.json({ results: data });
    // res.json(res.paginatedData);
  }
);

export const UpdateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { params, body } = req;
  const { id } = params;
  const results = await Blog.findByIdAndUpdate(id, body, { new: true });
  res.json({ results });
});

export const ReviewPost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { params, body } = req;
    const { id } = params;

    const data = await Blog.findByIdAndUpdate(
      id,
      {
        $push: { reviews: body },
      },
      { new: true }
    );
    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: "Some thing was wrong" });
  }
});

export const GetRelativePosts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const currentId = req.query.id;
      const query = currentId ? { _id: { $not: currentId } } : {};
      const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(9);
      res.json({ results: blogs });
    } catch (err) {
      res.status(400).json({ message: "Some thing was wrong" });
    }
  }
);
