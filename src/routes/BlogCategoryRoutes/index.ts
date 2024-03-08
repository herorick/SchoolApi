import express from "express";
import { Authenticate, DtoValidationMiddleware } from "../../middlewares";
import { CreateBlogCategoryDTO } from "../../dtos/BlogCategory";
import {
  CreateBlogCategory,
  DeleteBlogCategory,
  UpdateBlogCategory,
  GetBlogsByCategory,
  GetCategories,
} from "../../controllers/BlogCategoryController";
import { ValidateObjectId } from "../../middlewares/ValidateObjectId";
import { DeleteBlogCategories } from "../../controllers/ProductCategoryController";
import { PaginateResultsMiddleware } from "../../middlewares/PaginationMiddleware";
import { BlogCategory } from "../../models";

const router = express.Router();

router.get("/", PaginateResultsMiddleware(BlogCategory), GetCategories);
router.get("/:id", ValidateObjectId, GetBlogsByCategory);

router.use(Authenticate);
router.post(
  "/",
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  CreateBlogCategory
);
router.put(
  "/:id",
  ValidateObjectId,
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  UpdateBlogCategory
);
router.delete("/:id", DeleteBlogCategory);

router.delete("/", DeleteBlogCategories);

export { router as BlogCategoryRoutes };
