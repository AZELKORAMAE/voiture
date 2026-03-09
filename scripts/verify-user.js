const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable");
    process.exit(1);
}

// Minimal user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' },
    status: { type: String, default: 'APPROVED' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const emails = ['azelkoramae@gmail.com', 'azzelkoramae@gmail.com'];

        for (const email of emails) {
            const user = await User.findOne({ email });
            console.log(`User ${email} found:`, !!user);
            if (user) {
                console.log("User details:", { id: user._id, email: user.email, role: user.role });
            }
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdminUser();
