import { ICartItem } from "./Cart";

export interface CustomerPayload {
  id: string;
  email: string;
  verified: boolean;
}

export interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: any[];
  cart: ICartItem[];
  wishlist: any[];
  orders: any[];
  lat: number;
  lng: number;
  otp: number;
  otp_expiry: Date;
  verified: boolean;
}