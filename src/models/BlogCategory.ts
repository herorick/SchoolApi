import mongoose, { Document, Schema } from "mongoose";

interface BlogCategoryDoc extends Document {
  title: string;
  description: string;
  blogs: any[]
}

const BlogCategorySchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
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

BlogCategorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const BlogCategory = mongoose.model<BlogCategoryDoc>(
  "blogCategory",
  BlogCategorySchema
);

export { BlogCategory };
