import express from "express";
import {
  LoginVendorDTO,
  UpdateVendorDTO,
  UpdateVendorPasswordDTO,
} from "../../dtos";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorPassword,
  DeleteAllVendors,
  GetOffers,
  AddOffer,
  EditOffer,
  ProcessOrder,
  GetOrderDetails,
  GetVendorOrders,
  DeleteOffer,
  GetTransactions,
  RejectOrder,
  GetOffer,
  GetVendorProducts,
  VendorUpdateSettings,
} from "../../controllers";
import { Authenticate, DtoValidationMiddleware } from "../../middlewares";
import { initMulter } from "../../config/multer";
import { Order, Product } from "../../models";
import { PaginateResultsMiddleware } from "../../middlewares/PaginationMiddleware";
import { Offer } from "models/Offer";

const router = express.Router();
const imagesMiddleware = initMulter();
router.post("/login", DtoValidationMiddleware(LoginVendorDTO), VendorLogin);

router.use(Authenticate);
router.get("/", GetVendorProfile);

router.get("/profile", GetVendorProfile);
router.patch("/coverImage", imagesMiddleware, UpdateVendorCoverImage);
router.patch(
  "/profile",
  DtoValidationMiddleware(UpdateVendorDTO),
  UpdateVendorProfile
);
router.post(
  "/profile/updatePassword",
  DtoValidationMiddleware(UpdateVendorPasswordDTO),
  UpdateVendorPassword
);
router.delete("/", DeleteAllVendors);

// Orders
router.get("/orders", PaginateResultsMiddleware(Order), GetVendorOrders);
router.put("/order/:id/process", ProcessOrder);
router.put("/order/:id/reject", RejectOrder);
router.get("/order/:id", GetOrderDetails);

//Offers
router.get("/offers", PaginateResultsMiddleware(Offer), GetOffers);
router.get("/offer/:id", GetOffer);
router.post("/offer", AddOffer);
router.put("/offer/:id", EditOffer);
router.delete("/offer/:id", DeleteOffer);

// Transaction
router.get("/transactions", GetTransactions);

router.get(
  "/product",
  Authenticate,
  PaginateResultsMiddleware(Product),
  GetVendorProducts
);

router.put(
  "/settings",
  Authenticate,
  imagesMiddleware,
  VendorUpdateSettings
);

export { router as VendorRoutes };
