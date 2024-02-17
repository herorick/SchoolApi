import { ICartItem } from "./Cart";

export interface ICreateOrder {
  txnId: string;
  amount: number;
  deliveryId: string;
  items: ICartItem[];
}
