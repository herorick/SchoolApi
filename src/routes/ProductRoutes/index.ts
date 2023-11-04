import express, { Request, Response, NextFunction } from "express";
import { GetVendorProfile } from "controllers/VendorController";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateProduct,
  DeleteProduct,
  GetProductById,
  GetProducts,
} from "controllers";
import { CreateProductDTO } from "dtos/ProductDto";
import { initMulter } from "config/multer";
import { PaginateResultsMiddleware } from "middlewares/PaginationMiddleware";
import { Product } from "models";

const router = express.Router();
const imagesMiddleware = initMulter();

router.get("", PaginateResultsMiddleware(Product), GetProducts);
router.get("/:id", GetProductById);
router.post(
  "/",
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateProductDTO),
  CreateProduct
);
router.patch(
  "/:id",
  Authenticate,
  DtoValidationMiddleware(CreateProductDTO),
  GetVendorProfile
);
router.delete("/:id", Authenticate, DeleteProduct);

export { router as ProductRoutes };
