import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface CouponDoc extends Document {
  code: String;
  limit: Number;
  expirationDate: Date;
  discountPercentage: Number;
}

const CouponSchema = new Schema(
  {
    code: { type: String, require: true, unique: true },
    limit: { type: Number, require: true },
    discountPercentage: { type: Number, require: true },
    expirationDate: { type: Date, require: true },
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

CouponSchema.plugin(mongooseUniqueValidator);

CouponSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Coupon = mongoose.model<CouponDoc>("coupon", CouponSchema);

export { Coupon };
