import {
  GetAvailableOffers,
  getAvaibleDelivery,
  GetBestSale,
  GetProducts,
  GetTopVendor,
  GetVendorById,
  SearchProducts,
} from "../../controllers/ShoppingController";
import express from "express";

const router = express.Router();

router.get("/top-vendor/", GetTopVendor);

router.get("/products", GetProducts);

router.get("/shopping/delivery", getAvaibleDelivery);

router.get("/products/best-sale", GetBestSale);


router.get("/search/", SearchProducts);

router.get("/offers/", GetAvailableOffers);

router.get("/vendor/:id", GetVendorById);

export { router as ShoppingRoutes };
