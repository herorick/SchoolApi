import mongoose, { Document, Schema } from "mongoose";

export enum orderStatusEnums {
  waitingApprove = "waitingApprove",
  waitingDelivery = "waitingDelivery",
  delivered = "delivered",
  cancelled = "cancelled",
}

export interface OrderDoc extends Document {
  orderId: string;
  amount: number;
  paidAmount: number;
  status: orderStatusEnums;
  address: any[];
  items: any[];
  remarks: string;
  date: Date;
  paidThrough: string; // COD, Credit Card, Wallt,
  paymentResponse: string; // {status: true, response: some bank response}
  deliveryId: string;
  appliedOffers: boolean;
  offerId: string;
  verifyImage: string[];

  customerId: string;
  vendorId: string;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, require: true },
    amount: { type: Number, require: true },
    paidAmount: { type: Number, require: true },
    status: {
      type: String,
      require: true,
      enum: ["waitingApprove", "waitingDelivery", "delivered", "cancelled"],
    },
    remarks: { type: String, require: true },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    verifyImage: [{ type: String }],
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "vendor",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, record) {
        delete record.__v;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };
