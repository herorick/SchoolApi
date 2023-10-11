import express, { Request, Response, NextFunction } from "express";
import { LoginVendorDTO, UpdateVendorDTO } from "dtos";
import { VendorLogin, GetVendorProfile, UpdateVendorProfile } from "controllers";
import { Authenticate, dtoValidationMiddleware } from "middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Vendor" });
});

router.post("/login", dtoValidationMiddleware(LoginVendorDTO), VendorLogin);
router.get("/profile", Authenticate, GetVendorProfile);
router.patch('/profile', Authenticate,dtoValidationMiddleware(UpdateVendorDTO), UpdateVendorProfile)

export { router as VendorRoutes };
