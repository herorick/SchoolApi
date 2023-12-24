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
import { AuthenticateCustomer, DtoValidationMiddleware } from "middlewares";
import { CreateCustomerDTO } from "dtos/CustomerDto";

const router = express.Router();
const imagesMiddleware = initMulter();

router.post(
  "/signup",
  DtoValidationMiddleware(CreateCustomerDTO),
  CustomerSignUp
);
router.post("/signIn", CustomerSignIn);
router.get("/verify", AuthenticateCustomer, CustomerVerify);
router.patch("/otp", AuthenticateCustomer, CustomerRequestOTP);
router.get("/profile", AuthenticateCustomer, CustomerGetProfile);
router.patch("/profile", AuthenticateCustomer, CustomerEditProfile);

export { router as CustomerRoutes };
