const mongoose = require('mongoose');
const { Schema } = mongoose;

const FoodPostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    quantity: {
        type: String,
        required: [true, 'Please specify the quantity'],
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please provide a pickup location'],
    },
    status: {
        type: String,
        enum: ['Available', 'Claimed', 'In-Progress', 'Delivered'], // <-- ADD 'In-Progress'
        default: 'Available',
    },
    
    // The relationship to the User who created the post
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // The relationship to the User (NGO) who claimed the post
    claimedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('FoodPost', FoodPostSchema);