import express, { Request, Response, NextFunction } from "express";
import { LoginVendorDTO, UpdateVendorDTO, UpdateVendorPasswordDTO } from "dtos";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorPassword,
} from "controllers";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { initMulter } from "config/multer";

const router = express.Router();
const imagesMiddleware = initMulter();

router.get("/", Authenticate, GetVendorProfile);

router.post("/login", DtoValidationMiddleware(LoginVendorDTO), VendorLogin);
router.get("/profile", Authenticate, GetVendorProfile);
router.patch(
  "/coverImage",
  Authenticate,
  imagesMiddleware,
  UpdateVendorCoverImage
);
router.patch(
  "/profile",
  Authenticate,
  DtoValidationMiddleware(UpdateVendorDTO),
  UpdateVendorProfile
);
router.post(
  "/profile/updatePassword",
  Authenticate,
  DtoValidationMiddleware(UpdateVendorPasswordDTO),
  UpdateVendorPassword
);

export { router as VendorRoutes };
