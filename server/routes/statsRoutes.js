// server/routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodPost = require('../models/FoodPost');

router.get('/public', async (req, res) => {
    try {
        const mealsServed = await FoodPost.countDocuments({ status: 'Delivered' });
        
        // --- THIS IS THE FIX ---
        // We are now counting all users with the 'VOLUNTEER' role.
        const activeVolunteers = await User.countDocuments({ role: 'VOLUNTEER' });
        // --- END OF FIX ---

        const estimatedMeals = mealsServed * 25; // Average 25 meals per post

        res.status(200).json({
            mealsServed: estimatedMeals,
            activeVolunteers
        });
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;