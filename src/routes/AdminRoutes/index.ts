import { initMulter } from "config/multer";
import {
  AdminGetDeliveryUsers,
  CreateVendor,
  DeleteAllVendors,
  DeleteVendorById,
  GetTransactionById,
  GetTransactions,
  GetVendorById,
  GetVendors,
  UpdateVendor,
  VerifyDeliveryUser,
} from "controllers/AdminController";
import { CreateVendorDTO } from "dtos";
import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();
const imagesMiddleware = initMulter();

router.post(
  "/vendors",
  imagesMiddleware,
  DtoValidationMiddleware(CreateVendorDTO),
  CreateVendor
);

router.get("/vendors", Authenticate, GetVendors);
router.get("/vendors/:id", Authenticate, ValidateObjectId, GetVendorById);
router.patch("/vendors/:id", Authenticate, ValidateObjectId, UpdateVendor);
router.delete("/vendors:/id", Authenticate, ValidateObjectId, DeleteVendorById);
router.delete("/vendors", Authenticate, DeleteAllVendors);

// transaction
router.get('/transactions', GetTransactions)
router.get('/transaction/:id', GetTransactionById)

// delivery
router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/users', AdminGetDeliveryUsers);

export { router as AdminRoutes };
