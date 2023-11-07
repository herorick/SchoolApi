import mongoose, { Document, Schema } from "mongoose";

interface CouponDoc extends Document {
  code: String;
  limit: Number;
  expirationDate: Date;
  discountPercentage: Number;
}

const CouponSchema = new Schema(
  {
    code: { type: String, require: true },
    limit: { type: Number, require: true },
    discountPercentage: { type: Number, require: true },
    expirationDate: { type: Date, require: true },
  },
  {
    toJSON: {
      transform(doc, record) {
        delete record.__v, delete record.createAt, delete record.updateAt;
      },
    },
    timestamps: true,
  }
);

const Coupon = mongoose.model<CouponDoc>("coupon", CouponSchema);

export { Coupon };
