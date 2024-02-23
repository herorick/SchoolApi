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

const router = express.Router();

router.get("/", GetCategories);
router.get("/:id", ValidateObjectId, GetBlogsByCategory);

router.use(Authenticate);
router.post(
  "/",
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  CreateBlogCategory
);
router.patch(
  "/:id",
  ValidateObjectId,
  DtoValidationMiddleware(CreateBlogCategoryDTO),
  UpdateBlogCategory
);
router.delete("/:id", DeleteBlogCategory);

router.delete("/", DeleteBlogCategories)

export { router as BlogCategoryRoutes };
