import {
  CreateVendor,
  DeleteAllVendors,
  DeleteVendorById,
  GetVendorById,
  GetVendors,
  UpdateVendor,
} from "controllers/AdminController";
import { CreateVendorDTO } from "dtos";
import express, { Request, Response, NextFunction } from "express";
import { dtoValidationMiddleware } from "middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

router.post("/vendors", dtoValidationMiddleware(CreateVendorDTO), CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendors/:id", GetVendorById);
router.patch("/vendors/:id", UpdateVendor);
router.delete("/vendors:/id", DeleteVendorById);
router.delete("/vendors", DeleteAllVendors);

export { router as AdminRoutes };
