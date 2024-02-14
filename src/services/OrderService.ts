import { Customer, CustomerDoc, Order } from "@/models";
import { NotFound } from "@/utilities";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./ProductService";
import { ICartItem } from "@/interfaces/Cart";

class OrderService {
  static getOrderById = async (orderId: string) => {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      throw new NotFound("order not found by id" + orderId);
    }
    return order;
  };

  static getOrdersByCustomer = async (customerId: string) => {
    const profile = await Customer.findById(customerId).populate("orders");
    if (!profile) {
      throw new NotFound("customer not found by id" + customerId);
    }
    return profile;
  };
  /**
   * 
   * @param items 
   * @param txnId 
   * @param amount 
   * @param profile 
   * @description
   *  - verify customer token
   *  - calculate order amount
   *  - create order with item description
   *  - Update order to user account
   * @returns 
   */
  static createOrder = async (
    items: ICartItem[],
    txnId: string,
    amount: number,
    profile: CustomerDoc
  ) => {
    //  const { status, currentTransaction } =  await validateTransaction(txnId);

    //  if(!status){
    //      return res.status(404).json({ message: 'Error while Creating Order!'})
    //  }

    const orderId = uuidv4();
    let cartItems = Array();
    let netAmount = 0.0;
    let vendorId;
    const products = await ProductService.findProductByIds(
      items.map((item) => item.id)
    );
    console.log({ items });

    products.forEach((product) => {
      items.forEach(({ id, unit }) => {
        if (ProductService.getProductId(product) === id) {
          vendorId = product.vendor;
          netAmount += product.price * unit;
          cartItems.push({ product, unit });
        }
      });
    });

    const currentOrder = await Order.create({
      orderId,
      vendorId,
      items: cartItems,
      amount: netAmount,
      paidAmount: amount,
      date: new Date(),
      status: "Waiting",
      remarks: "",
      deliveryId: "",
    });

    profile.cart = [] as any;
    profile.orders.push(currentOrder);

    //  currentTransaction.vendorId = vendorId;
    //  currentTransaction.orderId = orderId;
    //  currentTransaction.status = 'CONFIRMED'

    //  await currentTransaction.save();

    //  await assignOrderForDelivery(currentOrder._id, vendorId);

    return await profile.save();
  };
}

export { OrderService };
