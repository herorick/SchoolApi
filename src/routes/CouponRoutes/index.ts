import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import {
  CreateCoupon,
  GetAllCoupon,
  GetCoupon,
  RemoveCoupon,
} from "controllers/CouponController";
import { CreateCouponDTO } from "dtos/CouponDto";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();

router.get("", GetAllCoupon);
router.get("/:id", ValidateObjectId, GetCoupon);
router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateCouponDTO),
  CreateCoupon
);
router.patch(
  "/:id",
  ValidateObjectId,
  Authenticate,
  DtoValidationMiddleware(CreateCouponDTO),
  CreateCoupon
);
router.delete("/:id", ValidateObjectId, Authenticate, RemoveCoupon);

export { router as CouponRoutes };
