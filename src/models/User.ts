import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['ADMIN', 'AGENCY', 'CUSTOMER'],
        default: 'CUSTOMER'
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DELETED'],
        default: 'APPROVED'
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
