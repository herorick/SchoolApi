export interface CreateOfferInputs {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: "USER" | "ALL" | "BANK" | "CARD";
  bank: [any];
  bins: [any];
  isActive: boolean;
  status: "draft" | "scheduled" | "active" | "expired";
  numberOfTimes: number;
  isUnlimited: boolean;
}
