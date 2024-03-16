import { ICustomer } from "../interfaces/Customer";
import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface CustomerDoc extends ICustomer, Document { }

const CustomerSchema = new Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    lat: { type: Number },
    lng: { type: Number },
    otp: { type: Number },
    otp_expiry: { type: Date },
    verified: { type: Boolean },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    phone: { type: String, require: true },
    setting: { type: Object },
    favoriteVendor: [
      {
        type: Schema.Types.ObjectId, ref: "vendor"
      }
    ],
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
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
  },
  {
    toJSON: {
      transform(doc, record) {
        delete record.password,
          delete record.salt,
          delete record.__v,
          delete record.createAt,
          delete record.updateAt;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

CustomerSchema.plugin(mongooseUniqueValidator);

CustomerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
