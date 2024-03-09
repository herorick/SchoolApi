import mongoose, { Document, Schema } from "mongoose";

interface BlogDoc extends Document {
  title: string;
  content: string;
  tags: string[];
  author: string;
  blogCategorys: any[];
  reviews: any;
  images: string[];
}

const BlogSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    tags: { type: Object, require: true },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "vendor",
    },
    blogCategorys: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "blogCategory",
      },
    ],
    reviews: [
      {
        type: Object,
      },
    ],
    images: [{ type: String, require: true }],
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

BlogSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Blog = mongoose.model<BlogDoc>("blog", BlogSchema);

export { Blog };
