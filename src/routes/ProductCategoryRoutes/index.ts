import express, { Request, Response, NextFunction } from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateProductCategory,
  DeleteProductCategory,
  GetProductCategories,
  GetProductCategoryById,
  UpdateProductCategory,
} from "controllers/ProductCategoryController";
import { CreateProductCategoryDTO } from "dtos/ProductCategoryDto";
import { ValidateObjectId } from "middlewares/ValidateObjectId";
import { initMulter } from "config/multer";

const router = express.Router();
const imagesMiddleware = initMulter();

router.get("", GetProductCategories);
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

export { router as ProductCategoryRoute };
