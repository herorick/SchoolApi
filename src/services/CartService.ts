import { ICartItem } from "interfaces/Cart";
import { CustomerDoc } from "../models";

class CartService {
  static addToCart = async (cartItem: ICartItem, profile: CustomerDoc) => {
    try {
      const { product, unit } = cartItem;
      const cartItems = profile.cart || [];
      if (cartItems.length > 0) {
        let existFoodItems = cartItems.filter(
          (item) => item.product.toString() === product
        );
        if (existFoodItems.length > 0) {
          const index = cartItems.indexOf(existFoodItems[0]);
          if (unit > 0) {
            cartItems[index] = { product, unit }; // update
          } else {
            cartItems.splice(index, 1); // remove
          }
        } else {
          cartItems.push({ product, unit }); // add
        }
      } else {
        // add new Item
        cartItems.push({ product, unit }); // add
      }
      profile.cart = cartItems;
      const cartResult = await profile.save();
      return cartResult;
    } catch (err) {
      console.log(err);
      throw new Error("something was wrong!!");
    }
  };
  static deleteCart = async (profile: CustomerDoc) => {
    try {
      profile.cart = [] as ICartItem[];
      const response = await profile.save();
      return response;
    } catch (err) {
      throw new Error("Something was wrong");
    }
  };
}

export { CartService };
