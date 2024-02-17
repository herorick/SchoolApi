import mongoose, { Schema, Document, Model } from 'mongoose';


export interface OfferDoc extends Document {
    offerType: string;
    vendors: [any];
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity: Date;
    endValidity: Date;
    promocode: string;
    promoType: string;
    bank: [any];
    bins: [any];
    isActive: boolean;
}


const OfferSchema = new Schema({

    offerType: { type: String, require: true },
    vendors: [
        { type: Schema.Types.ObjectId, ref: 'vendor' },
    ],
    title: { type: String, require: true },
    description: { type: String },
    minValue: { type: Number, require: true },
    offerAmount: { type: Number, require: true },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, require: true },
    promoType: { type: String, require: true, enum: ['USER', 'ALL', 'BANK', 'CARRD'] },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    isActive: { type: Boolean }

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);

export { Offer }