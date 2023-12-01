import { initMulter } from "config/multer";
import {
  CreateVendor,
  DeleteAllVendors,
  DeleteVendorById,
  GetVendorById,
  GetVendors,
  UpdateVendor,
} from "controllers/AdminController";
import { CreateVendorDTO } from "dtos";
import express from "express";
import { DtoValidationMiddleware } from "middlewares";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();
const imagesMiddleware = initMulter();
router.post(
  "/vendors",
  imagesMiddleware,
  DtoValidationMiddleware(CreateVendorDTO),
  CreateVendor
);

router.get("/vendors", GetVendors);
router.get("/vendors/:id", ValidateObjectId, GetVendorById);
router.patch("/vendors/:id", ValidateObjectId, UpdateVendor);
router.delete("/vendors:/id", ValidateObjectId, DeleteVendorById);
router.delete("/vendors", DeleteAllVendors);

export { router as AdminRoutes };
