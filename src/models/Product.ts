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
  productCategories: any[];
}

export interface ProductDoc extends IProduct, Document {}

const ProductSchema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    vendor: { type: String, require: true },
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

// @ts-ignore
var autoPopulateLead = function (next) {
  // @ts-ignore
  this.populate("brand").populate("productCategories");
  next();
};

ProductSchema.pre("find", autoPopulateLead);

const Product = mongoose.model<ProductDoc>("product", ProductSchema);

export { Product };
