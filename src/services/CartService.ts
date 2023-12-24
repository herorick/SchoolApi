import { ICartItem } from "@/interfaces/Cart";
import { CustomerDoc } from "@/models";

class CartService {
  static addToCart = async (cartItem: ICartItem, profile: CustomerDoc) => {
    try {
      const { id, unit } = cartItem;
      let cartItems = [];
      cartItems = profile.cart;
      if (cartItems.length > 0) {
        let existFoodItems = cartItems.filter(
          (item) => item.id.toString() === id
        );
        if (existFoodItems.length > 0) {
          const index = cartItems.indexOf(existFoodItems[0]);
          if (unit > 0) {
            cartItems[index] = { id, unit }; // update
          } else {
            cartItems.splice(index, 1); // remove
          }
        } else {
          cartItems.push({ id, unit }); // add
        }
      } else {
        // add new Item
        cartItems.push({ id, unit }); // add
      }
      profile.cart = cartItems;
      const cartResult = await profile.save();
      return cartResult;
    } catch (err) {
      throw new Error("something was wrong!!");
    }
  };
  static deleteCart = async (profile: CustomerDoc) => {
    try {
        profile.cart = [] as ICartItem[];
        return await profile.save();
    }catch(err) {
        throw new Error("Something was wrong")
    }
  };
}

export { CartService };
