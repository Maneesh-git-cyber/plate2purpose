const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['DONOR', 'NGO', 'VOLUNTEER', 'ADMIN'],
        required: true,
    },
    
    // --- THIS IS THE SINGLE SOURCE OF TRUTH FOR VERIFICATION ---
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
    },

    // isVerified: { type: Boolean, default: false }, // <-- THIS LINE HAS BEEN DELETED

    verificationDetails: {
        businessName: { type: String },
        businessAddress: { type: String },
        contactPhoneNumber: { type: String },
        foodLicenseId: { type: String },
        organizationAddress: { type: String },
        registrationId: { type: String },
        proofDocumentUrl: { type: String },
        vehicleDetails: { type: String },
        idProofUrl: { type: String },
    }
}, { timestamps: true });


// --- Password hashing and comparison methods remain the same ---

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);