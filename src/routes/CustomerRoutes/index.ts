import express from "express";
import {
  CustomerSignIn,
  CustomerSignUp,
  CustomerVerify,
  CustomerRequestOTP,
  CustomerGetProfile,
  CustomerEditProfile,
} from "controllers";
import { initMulter } from "config/multer";
import { DtoValidationMiddleware } from "middlewares";
import { CreateCustomerDTO } from "dtos/CustomerDto";

const router = express.Router();
const imagesMiddleware = initMulter();

router.post(
  "/signup",
  DtoValidationMiddleware(CreateCustomerDTO),
  CustomerSignUp
);
router.post("/signIn", CustomerSignIn);
router.get("/verify", CustomerVerify);
router.patch("/otp", CustomerRequestOTP);
router.get("/profile", CustomerGetProfile);
router.patch("/profile", CustomerEditProfile);

export { router as CustomerRoutes };
