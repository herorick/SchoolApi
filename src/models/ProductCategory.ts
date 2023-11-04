import mongoose, { Document, Schema } from "mongoose";

interface ProductCategoryDoc extends Document {
  title: string;
  description: string;
  products: any[]
}

const ProductCategorySchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
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

const ProductCategory = mongoose.model<ProductCategoryDoc>(
  "productCategory",
  ProductCategorySchema
);

export { ProductCategory };
