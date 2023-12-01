import mongoose, { Document, Schema } from "mongoose";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  phone: string;
  address: any[];
  cart: any[];
  wishlist: any[];
  orders: any[];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    phone: { type: String, require: true },
    address: [{ type: Schema.Types.ObjectId, ref: "address", require: true }],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product", require: true },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        require: true,
      },
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "order", require: true }],
  },
  {
    toJSON: {
      transform(doc, record) {
        delete record.__v, delete record.createAt, delete record.updateAt;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

CustomerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
