import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateProduct,
  DeleteProduct,
  GetProductById,
  GetProducts,
  UpdateProduct,
} from "controllers";
import { CreateProductDTO } from "dtos/ProductDto";
import { initMulter } from "config/multer";
import { PaginateResultsMiddleware } from "middlewares/PaginationMiddleware";
import { Product } from "models";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();
const imagesMiddleware = initMulter();

router.get("", PaginateResultsMiddleware(Product), GetProducts);
router.get("/:id", ValidateObjectId, GetProductById);
router.post(
  "/",
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateProductDTO),
  CreateProduct
);
router.patch(
  "/:id",
  ValidateObjectId,
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateProductDTO),
  UpdateProduct
);
router.delete("/:id", ValidateObjectId, Authenticate, DeleteProduct);

export { router as ProductRoutes };
