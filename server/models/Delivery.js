const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeliverySchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'In-Progress', 'Completed'], // Status must be one of these
        default: 'Pending', // New deliveries always start as 'Pending'
    },

    // --- RELATIONSHIPS (The "Foreign Keys") ---

    foodPost: {
        type: Schema.Types.ObjectId,
        ref: 'FoodPost', // Links to a document in the 'FoodPost' collection
        required: true,
    },

    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the User who created the post
        required: true,
    },

    ngo: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the User (NGO) who claimed the post
        required: true,
    },

    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the User (Volunteer) who accepts the delivery
        // This is NOT required initially, as a task starts unassigned.
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Delivery', DeliverySchema);