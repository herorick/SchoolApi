import mongoose, { Document, Schema } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImage: [string];
  rating: number;
  products: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, require: true },
    ownerName: { type: String, require: true },
    foodType: { type: [String] },
    pinCode: { type: String, require: true },
    address: { type: String },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    serviceAvailable: { type: Boolean },
    coverImage: { type: [String] },
    rating: { type: Number },
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "products",
      },
    ],
  },
  {
    toJSON: {
      // when return record, we remove password and salt
      transform(doc, record) {
        delete record.password, delete record.salt;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);

export { Vendor };
