import mongoose, { Schema, Document, Model } from "mongoose";

export interface TransactionDoc extends Document {
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
  customerId: string;
  vendorId: string;
  orderId: string;
  customer: any;
  vendor: any;
  order: any;
}

// create payment  => transaction
const TransactionSchema = new Schema(
  {
    customerId: { type: String },
    vendorId: { type: String },
    orderId: { type: String },

    order: { type: Schema.Types.ObjectId, ref: "order" },
    vendor: { type: Schema.Types.ObjectId, ref: "vendor" },
    customer: { type: Schema.Types.ObjectId, ref: "customer", require: true },

    orderValue: Number,
    offerUsed: String,
    status: String,
    paymentMode: String,
    paymentResponse: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);

export { Transaction };
