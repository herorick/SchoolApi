import { ICartItem } from "./Cart";

export interface ICreateOrder {
  txnId: string;
  amount: number;
  items: ICartItem[];
}
