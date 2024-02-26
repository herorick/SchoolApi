import {
  GetAvailableOffers,
  GetBestSale,
  GetProducts,
  GetTopVendor,
  GetVendorById,
  SearchProducts,
} from "../../controllers/ShoppingController";
import express from "express";

const router = express.Router();

router.get("/products", GetProducts);

router.get("/products/best-sale", GetBestSale);

router.get("/top-restaurant/:pincode", GetTopVendor);

router.get("/search/", SearchProducts);

router.get("/offers/", GetAvailableOffers);

router.get("/restaurant/:id", GetVendorById);

export { router as ShoppingRoutes };
