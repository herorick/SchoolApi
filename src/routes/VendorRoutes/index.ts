import express, { Request, Response, NextFunction } from "express";
import { LoginVendorDTO, UpdateVendorDTO } from "dtos";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorCoverImage,
} from "controllers";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { initMulter } from "config/multer";

const router = express.Router();
const imagesMiddleware = initMulter();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor" });
});

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

export { router as VendorRoutes };
