import mongoose, { Schema } from 'mongoose';

const CarSchema = new Schema({
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, enum: ['Luxury', 'SUV', 'Economy', 'Sport', 'Electric'], required: true },
    specs: {
        transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
        fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
        seats: { type: Number, required: true },
        power: { type: String }, // e.g., "300 HP"
    },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String }],
    availability: [{
        startDate: { type: Date },
        endDate: { type: Date }
    }],
    features: [{ type: String }] // e.g., ["GPS", "Sunroof", "Leather Seats"]
}, { timestamps: true });

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
