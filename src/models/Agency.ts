import mongoose, { Schema } from 'mongoose';

const AgencySchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    contactEmail: { type: String },
    contactPhone: { type: String },
    rating: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

AgencySchema.index({ location: '2dsphere' });

export default mongoose.models.Agency || mongoose.model('Agency', AgencySchema);
