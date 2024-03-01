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
  ClearCart,
  AddToCart,
  VerifyOffer,
  CreatePayment,
  CustomerAddWishList,
  CustomerRemoveWishList,
  CustomerUpdateSetting,
  CustomerAddFavoriteVendor,
  CustomerRemoveFavoriteVendor,
  CustomerGetWishList,
  UpdateQuantityCartItem,
  DeleteCartItems,
} from "../../controllers";
import { initMulter } from "../../config/multer";
import {
  AuthenticateCustomer,
  DtoValidationMiddleware,
} from "../../middlewares";
import {
  CreateCustomerDTO,
  CustomSignInValidator,
  CustomSignUpValidator,
} from "../../dtos/CustomerDto";

const router = express.Router();
const imagesMiddleware = initMulter();

router.post(
  "/signup",
  DtoValidationMiddleware(CreateCustomerDTO),
  CustomerSignUp
);
router.post("/signIn", CustomSignInValidator, CustomerSignIn);
router.post("/verify", AuthenticateCustomer, CustomerVerify);
router.patch("/otp", AuthenticateCustomer, CustomerRequestOTP);
router.get("/profile", AuthenticateCustomer, CustomerGetProfile);
router.put("/profile", AuthenticateCustomer, CustomerEditProfile);

//Order
router.use(AuthenticateCustomer);
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

//Cart
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", ClearCart);

router.post("/cart/quantity", UpdateQuantityCartItem)
router.post("/cart/delete-cart-items", DeleteCartItems)

//Verify Offer
router.get("/offer/verify/:id", VerifyOffer);

//Payment
router.post("/create-payment", CreatePayment);

//WishList
router.get("/wishlist", CustomerGetWishList);
router.post("/wishlist/add", CustomerAddWishList);
router.post("/wishlist/remove", CustomerRemoveWishList);

//Setting
router.put("/setting", CustomerUpdateSetting);

//Favorite
router.post("/favorite/add", CustomerAddFavoriteVendor);
router.post("/favorite/remove", CustomerRemoveFavoriteVendor);

export { router as CustomerRoutes };
