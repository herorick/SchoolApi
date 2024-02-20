import { Customer, CustomerDoc, Order } from "@/models";
import { APIError, NotFound } from "@/utilities";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./ProductService";
import { ICartItem } from "@/interfaces/Cart";
import { TransactionService } from "./Transaction";

class OrderService {
  static getOrderById = async (orderId: string) => {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      throw new NotFound("order not found by id" + orderId);
    }
    return order;
  };

  static assignOrderForDelivery = async (
    orderId: string,
    deliveryId: string
  ) => {
    const order = await OrderService.getOrderById(orderId);
    if (order !== null) {
      order.deliveryId = deliveryId;
      await order.save();
    }
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
    deliveryId: string,
    profile: CustomerDoc
  ) => {
    const { status, currentTransaction } =
      await TransactionService.ValidateTransaction(txnId);

    if (!status) {
      throw new APIError("Error while Creating Order!");
    }

    const orderId = uuidv4();
    let cartItems = Array();
    let netAmount = 0.0;
    let vendorId: string = "";
    const products = await ProductService.findProductByIds(
      items.map((item) => item.id)
    );
    products.forEach((product) => {
      items.forEach(({ id, unit }) => {
        if (ProductService.getProductId(product) === id) {
          console.log({ product });
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
      deliveryId,
    });

    console.log({ deliveryId });
    console.log({ currentOrder });

    profile.cart = [] as any;
    profile.orders.push(currentOrder);

    if (currentTransaction !== null) {
      currentTransaction.vendor = vendorId;
      currentTransaction.order = currentOrder._id.toString();

      currentTransaction.vendorId = vendorId;
      currentTransaction.orderId = currentOrder._id.toString();
      currentTransaction.status = "CONFIRMED";
      await currentTransaction.save();
    }

    //  await this.assignOrderForDelivery(currentOrder.id,  );

    return await profile.save();
  };
}

export { OrderService };
