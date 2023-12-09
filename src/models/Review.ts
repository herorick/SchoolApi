import mongoose, { Document, Schema } from "mongoose";

interface ReviewDoc extends Document {
  product: any;
  auth: any;
  description: string;
  rating: number;
  like: any[];
}

const ReviewSchema = new Schema(
  {
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      require: true,
    },
    auth: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "customer",
      require: true,
    },
    description: {
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
        require: true,
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
