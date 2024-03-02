import { Customer, Order } from "../models";
import { NotFound } from "../utilities";

class CustomerService {
  static getOrderById = async (orderId: string) => {
    const order = await Customer.findById(orderId).populate("items.product");
    if (!order) {
      throw new NotFound("order not found by id" + orderId);
    }
    return order;
  };

  static getOrders = async (customerId: string) => {
    const orders = await Order.find({ customerId }).populate("items.product");
    if (!orders) {
      throw new NotFound("Order not found by id" + customerId);
    }
    return orders;
  };

  static GetCustomerById = async (customerId: string) => {
    const profile = await Customer.findById(customerId);
    if (!profile) {
      throw new NotFound("customer not found by id" + customerId);
    }
    return profile;
  };
}
export { CustomerService };
