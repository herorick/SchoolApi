import mongoose, { Document, Schema } from "mongoose";

interface ReviewDoc extends Document {
  product: any;
  like: any[];
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}

const ReviewSchema = new Schema(
  {
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
    like: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "customer",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, record) {
        delete record.__v;
      },
      virtuals: true,
    },
    timestamps: true,
  }
);

ReviewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Review = mongoose.model<ReviewDoc>("review", ReviewSchema);

export { Review };
