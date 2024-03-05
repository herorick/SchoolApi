import mongoose, { Schema, Document, Model } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string;
  vendors: [any];
  title: string;
  description: string;
  minValue: number;
  offerAmount: number;
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string;
  isActive: boolean;
  numberOfTimes: number;
  isUnlimited: boolean;
  uses: number;
  status: "draft" | "scheduled" | "active" | "expired";
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, require: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
    title: { type: String, require: true },
    description: { type: String },
    minValue: { type: Number, require: true },
    offerAmount: { type: Number, require: true },
    startValidity: Date,
    endValidity: Date,
    promoCode: { type: String, require: true },
    promoType: {
      type: String,
      require: true,
      enum: ["USER", "ALL", "BANK", "CARD"],
    },
    status: {
      type: String,
      require: true,
      enum: ["draft", "scheduled", "active", "expired"],
    },
    isActive: { type: Boolean },
    numberOfTimes: { type: Number },
    isUnlimited: { type: Boolean },
    uses: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

OfferSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);

export { Offer };
