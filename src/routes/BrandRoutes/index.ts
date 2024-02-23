import express from "express";
import { Authenticate, DtoValidationMiddleware } from "../../middlewares";
import {
  CreateBrand,
  DeleteBrand,
  GetAllBrand,
  GetBrand,
  UpdateBrand,
} from "../../controllers/BrandController";
import { CreateBrandDTO } from "../../dtos/BrandDto";
import { ValidateObjectId } from "../../middlewares/ValidateObjectId";
import { PaginateResultsMiddleware } from "../../middlewares/PaginationMiddleware";
import { Brand } from "../../models";

const router = express.Router();

router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateBrandDTO),
  CreateBrand
);

router.patch("/:id", ValidateObjectId, Authenticate, UpdateBrand);

router.delete("/:id", ValidateObjectId, Authenticate, DeleteBrand);

router.get("/", PaginateResultsMiddleware(Brand), GetAllBrand);

router.get("/:id", ValidateObjectId, GetBrand);

export { router as BrandRoutes };
