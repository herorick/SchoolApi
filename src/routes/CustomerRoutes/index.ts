import express from "express";
import {
  CustomerSignIn,
  CustomerSignUp,
  CustomerVerify,
  CustomerRequestOTP,
  CustomerGetProfile,
  CustomerEditProfile,
  CreateOrder,
  GetOrders,
  GetOrderById,
  GetCart,
  DeleteCart,
  AddToCart,
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

//Order
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById)

//Cart
router.post('/cart', AddToCart)
router.get('/cart', GetCart)
router.delete('/cart', DeleteCart)

export { router as CustomerRoutes };
