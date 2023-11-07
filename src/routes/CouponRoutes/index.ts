import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateCoupon,
  GetAllCoupon,
  GetCoupon,
  RemoveCoupon,
} from "controllers/CouponController";
import { CreateCouponDTO } from "dtos/CouponDto";

const router = express.Router();

router.get("", GetAllCoupon);
router.get("/:id", GetCoupon);
router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateCouponDTO),
  CreateCoupon
);
router.patch(
  "/:id",
  Authenticate,
  DtoValidationMiddleware(CreateCouponDTO),
  CreateCoupon
);
router.delete("/:id", Authenticate, RemoveCoupon);

export { router as CouponRoutes };
