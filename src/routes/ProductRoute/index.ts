import express, { Request, Response, NextFunction } from "express";
import { LoginVendorDTO, UpdateVendorDTO } from "dtos";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
} from "controllers/VendorController";
import { Authenticate, dtoValidationMiddleware } from "middlewares";

const router = express.Router();

router.get("/", VendorLogin);
router.post("/", Authenticate, GetVendorProfile);
router.patch("/:id", Authenticate, GetVendorProfile);
router.delete(
  "/:id",
  Authenticate,
  dtoValidationMiddleware(UpdateVendorDTO),
  UpdateVendorProfile
);

export { router as ProductRoutes };
