import mongoose, { Document, Schema } from "mongoose";

interface OrderDoc extends Document {
  orderId: string;
  customerId: string;
  amount: number;
  status: string;
  address: any[];
  items: any[];
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, require: true },
    customerId: { type: String, require: true },
    amount: { type: Number, require: true },
    status: { type: String, require: true },
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
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
