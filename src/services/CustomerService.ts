import { Customer } from "@/models";
import { NotFound } from "@/utilities";

class CustomerService {
  static getOrderById = async (orderId: string) => {
    const order = await Customer.findById(orderId).populate("items.product");
    if (!order) {
      throw new NotFound("order not found by id" + orderId);
    }
    return order;
  };

  static getOrders = async (customerId: string) => {
    const profile = await Customer.findById(customerId).populate("orders");
    if (!profile) {
      throw new NotFound("customer not found by id" + customerId);
    }
    return profile;
  };
}
export { CustomerService };
