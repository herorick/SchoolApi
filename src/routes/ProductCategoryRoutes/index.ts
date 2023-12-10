import express, { Request, Response, NextFunction } from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateProductCategory,
  DeleteProductCategory,
  GetProductCategories,
  GetProductCategoryById,
  UpdateProductCategory,
  DeleteBlogCategories,
} from "controllers/ProductCategoryController";
import { CreateProductCategoryDTO } from "dtos/ProductCategoryDto";
import { ValidateObjectId } from "middlewares/ValidateObjectId";
import { initMulter } from "config/multer";
import { PaginateResultsMiddleware } from "middlewares/PaginationMiddleware";
import { ProductCategory } from "models";

const router = express.Router();
const imagesMiddleware = initMulter("image");

router.get(
  "",
  PaginateResultsMiddleware(ProductCategory),
  GetProductCategories
);
router.get("/:id", ValidateObjectId, GetProductCategoryById);
router.post(
  "/",
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateProductCategoryDTO),
  CreateProductCategory
);
router.patch(
  "/:id",
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateProductCategoryDTO),
  UpdateProductCategory
);
router.delete("/:id", ValidateObjectId, Authenticate, DeleteProductCategory);
router.delete("/", Authenticate, DeleteBlogCategories);

export { router as ProductCategoryRoute };
