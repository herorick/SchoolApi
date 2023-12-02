import mongoose, { Document, Schema } from "mongoose";

interface BannerDoc extends Document {
  mainImages: any[];
  images: any[];
}

const BannerSchema = new Schema(
  {
    mainImages: [
      {
        url: { type: String, require: true },
        link: { type: String, required: true },
      },
    ],
    images: [
      {
        url: { type: String, require: true },
        link: { type: String, required: true },
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

BannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Banner = mongoose.model<BannerDoc>("banner", BannerSchema);

export { Banner };
