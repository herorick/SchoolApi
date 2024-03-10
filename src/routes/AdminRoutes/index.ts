import { PaginateResultsMiddleware } from "../../middlewares/PaginationMiddleware";
import { DeliveryUser, Vendor } from "../../models";
import { initMulter } from "../../config/multer";
import {
  AdminGetDeliveryUsers,
  AdminGetTransactions,
  CreateVendor,
  DeleteAllVendors,
  DeleteVendorById,
  GetTransactionById,
  GetVendorById,
  GetVendors,
  AdminUpdateVendor,
  VerifyDeliveryUser,
  AdminInActiveVendor,
  AdminActiveVendor,
} from "../../controllers/AdminController";
import { CreateVendorDTO } from "../../dtos";
import express from "express";
import { Authenticate, DtoValidationMiddleware } from "../../middlewares";
import { ValidateObjectId } from "../../middlewares/ValidateObjectId";

const router = express.Router();
const imagesMiddleware = initMulter();

router.post(
  "/vendors",
  imagesMiddleware,
  DtoValidationMiddleware(CreateVendorDTO),
  CreateVendor
);

router.get(
  "/vendors",
  Authenticate,
  PaginateResultsMiddleware(Vendor),
  GetVendors
);
router.get("/vendors/:id", Authenticate, ValidateObjectId, GetVendorById);
router.patch("/vendors/:id", Authenticate, ValidateObjectId, AdminUpdateVendor);
router.delete("/vendors:/id", Authenticate, ValidateObjectId, DeleteVendorById);
router.delete("/vendors", Authenticate, DeleteAllVendors);

router.post(
  "/vendors/:id/active",
  Authenticate,
  ValidateObjectId,
  AdminActiveVendor
);

router.post(
  "/vendors/:id/in-active",
  Authenticate,
  ValidateObjectId,
  AdminInActiveVendor
);

// transaction
router.get("/transactions", AdminGetTransactions);
router.get("/transaction/:id", GetTransactionById);

// delivery
router.put("/delivery/verify", VerifyDeliveryUser);
router.get(
  "/delivery/users",
  PaginateResultsMiddleware(DeliveryUser),
  AdminGetDeliveryUsers
);

export { router as AdminRoutes };
