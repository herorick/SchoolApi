import { CustomerDoc, Vendor } from "@/models";
import { NotFound } from "@/utilities";
import { ICartItem } from "@/interfaces/Cart";

class VendorService {
  static GetVendorById = async (vendorId: string) => {
    const existingVendor = await Vendor.findById(vendorId);
    if (!existingVendor) {
      throw new NotFound("Vendor not found with id: " + vendorId);
    }
    return existingVendor;
  }

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

export { VendorService };
