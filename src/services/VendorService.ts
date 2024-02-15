import { Customer, CustomerDoc, Order } from "@/models";
import { NotFound } from "@/utilities";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "./ProductService";
import { ICartItem } from "@/interfaces/Cart";

class OrderService {

  static GetOffers = async (
    items: ICartItem[],
    txnId: string,
    amount: number,
    profile: CustomerDoc
  ) => {
   
  };

  static AddOffer = async (
    items: ICartItem[],
    txnId: string,
    amount: number,
    profile: CustomerDoc
  ) => {
   
  };

  static EditOffer = async (
    items: ICartItem[],
    txnId: string,
    amount: number,
    profile: CustomerDoc
  ) => {
   
  };
}

export { OrderService };
