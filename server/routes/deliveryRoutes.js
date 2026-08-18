const express = require('express');
const router = express.Router();

// Import all necessary controller functions
const {
    getVolunteerStats,
    getActiveDeliveries,
    getAvailableDeliveries,
    getVolunteerNotifications,
    acceptDelivery,
    updateDeliveryStatus
} = require('../controllers/deliveryController');

// Import our security middleware
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// --- DEFINE THE MAIN ROUTES ---

// GET Routes (Read operations)
router.route('/volunteer/stats').get(protect, authorize('VOLUNTEER'), getVolunteerStats);
router.route('/active').get(protect, authorize('VOLUNTEER'), getActiveDeliveries);
router.route('/available').get(protect, authorize('VOLUNTEER'), getAvailableDeliveries);
router.route('/notifications').get(protect, authorize('VOLUNTEER'), getVolunteerNotifications);

// PUT Routes (Update operations)
router.route('/:id/accept').put(protect, authorize('VOLUNTEER'), acceptDelivery);
router.route('/:id/status').put(protect, authorize('VOLUNTEER'), updateDeliveryStatus);


// --- TEMPORARY ROUTE FOR SEEDING DATA ---
// This route is for development purposes only to create test data easily.
router.post('/seed', async (req, res) => {
    try {
        const { foodPostId, donorId, ngoId } = req.body;
        
        // We require the Delivery model directly here to keep this logic self-contained
        const Delivery = require('../models/Delivery');

        const delivery = await Delivery.create({
            foodPost: foodPostId,
            donor: donorId,
            ngo: ngoId,
            status: 'Pending' // Creates an 'Available Job' for volunteers
        });
        
        res.status(201).json(delivery);

    } catch (error) {
        console.error('Seeding Error:', error);
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
});


module.exports = router;