import mongoose, { Document, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

export interface IProduct {
  vendor: any;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  images: [string];
  brand: any;
  blogs: any[];
  reviews: any[];
  productCategories: any[];
}

export interface ProductDoc extends IProduct, Document {}

const ProductSchema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    vendor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
    },
    description: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    rating: { type: Number },
    images: { type: [String] },
    brand: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "brand",
    },
    productCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "productCategory",
      },
    ],
    reviews: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "review",
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
      transform(doc, record) {
        delete record.__v, delete record.createAt, delete record.updateAt;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

ProductSchema.plugin(mongooseUniqueValidator);

ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Product = mongoose.model<ProductDoc>("product", ProductSchema);

export { Product };
