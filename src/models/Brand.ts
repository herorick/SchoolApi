import mongoose, { Document, Schema } from "mongoose";

interface BrandDoc extends Document {
  title: string;
  products: any[];
}

const BrandSchema = new Schema(
  {
    title: { type: String, require: true },
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "products",
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

const Brand = mongoose.model<BrandDoc>("brand", BrandSchema);

export { Brand };
