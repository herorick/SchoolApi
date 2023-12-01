import express, { Request, Response, NextFunction } from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { CreateProductCategory, DeleteProductCategory, GetProductCategories, GetProductCategoryById } from "controllers/ProductCategoryController";
import { CreateProductCategoryDTO } from "dtos/ProductCategoryDto";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();

router.get("", GetProductCategories);
router.get("/:id", ValidateObjectId, GetProductCategoryById);
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
router.delete("/:id", ValidateObjectId, Authenticate, DeleteProductCategory);

export { router as ProductCategoryRoute };
