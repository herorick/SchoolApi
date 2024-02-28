import mongoose, { Document, Schema } from "mongoose";

interface AddressDoc extends Document {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

/*
  tinh shipping
*/
const AddressSchema = new Schema(
  {
    street: { type: String, require: true },
    postalCode: { type: String, require: true },
    city: { type: String, require: true },
    country: { type: String, require: true },
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

AddressSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Address = mongoose.model<AddressDoc>("address", AddressSchema);

export { Address };
