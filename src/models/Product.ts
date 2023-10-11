import mongoose, { Document, Schema } from "mongoose";

interface ProductDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
  productsCategories: any[];
}

const ProductSchema = new Schema(
  {
    vendorId: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    rating: { type: Number },
    images: { type: [String] },
    productsCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "productsCategories",
      },
    ],
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

const Product = mongoose.model<ProductDoc>("product", ProductSchema);

export { Product };
