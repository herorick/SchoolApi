import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateBrand,
  DeleteBrand,
  GetAllBrand,
  GetBrand,
  UpdateBrand,
} from "controllers/BrandController";
import { CreateBrandDTO } from "dtos/BrandDto";

const router = express.Router();

router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateBrandDTO),
  CreateBrand
);

router.patch("/:id", Authenticate, UpdateBrand);

router.delete("/:id", Authenticate, DeleteBrand);

router.get("/", GetAllBrand);

router.get("/:id", GetBrand);

export { router as BrandRoutes };
