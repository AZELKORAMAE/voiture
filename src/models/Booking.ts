import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    },
    receiptUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
