import express, { Request, Response, NextFunction } from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { CreateProductCategory, DeleteProductCategory, GetProductCategories, GetProductCategoryById } from "controllers/ProductCategoryController";
import { CreateProductCategoryDTO } from "dtos/ProductCategoryDto";

const router = express.Router();

router.get("", GetProductCategories);
router.get("/:id", GetProductCategoryById);
router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateProductCategoryDTO),
  CreateProductCategory
);
// router.patch(
//   "/:id",
//   Authenticate,
//   DtoValidationMiddleware(CreateProductDTO),
//   GetVendorProfile
// );
router.delete("/:id", Authenticate, DeleteProductCategory);

export { router as ProductCategoryRoute };
