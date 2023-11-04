import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { CreateBlogCategoryDTO } from "dtos/BlogCategory";
import {
  CreateBlogCategory,
  DeleteBlogCategory,
  UpdateBlogCategory,
  GetBlogsByCategory,
  GetCategories
} from "controllers/BlogCategoryController";

const router = express.Router();

router.get("/", GetCategories);
router.get("/:id", GetBlogsByCategory);

router.use(Authenticate);
router.post(
  "/",
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  CreateBlogCategory
);
router.patch(
  "/:id",
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  UpdateBlogCategory
);
router.delete("/:id", DeleteBlogCategory);

export { router as BlogCategoryRoutes };
