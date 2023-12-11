import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

interface VendorDoc extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  coverImage: string;
  rating: number;
  blogs: any[];
  products: any[];
}

const VendorSchema = new Schema(
  {
    name: { type: String, require: true },
    address: { type: String },
    phone: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    coverImage: { type: String, require: true },
    rating: { type: Number },
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    blogs: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "blog",
      },
    ],
  },
  {
    toJSON: {
      // when return record, we remove password and salt
      transform(doc, record) {
        delete record.password, delete record.salt;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

VendorSchema.plugin(mongooseUniqueValidator);

VendorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);

export { Vendor };
