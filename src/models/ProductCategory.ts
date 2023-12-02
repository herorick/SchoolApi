import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface ProductCategoryDoc extends Document {
  title: string;
  description: string;
  products: any[];
  image: string;
}

const ProductCategorySchema = new Schema(
  {
    title: { type: String, require: true, unique: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
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
      virtuals: true,
    },
    timestamps: true,
  }
);

ProductCategorySchema.plugin(uniqueValidator);

ProductCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const ProductCategory = mongoose.model<ProductCategoryDoc>(
  "productCategory",
  ProductCategorySchema
);

export { ProductCategory };
