import mongoose, { Document, Schema } from "mongoose";

interface ProductDoc extends Document {
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

const ProductSchema = new Schema(
  {
    vendor: { type: String, require: true },
    name: { type: String, require: true },
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
