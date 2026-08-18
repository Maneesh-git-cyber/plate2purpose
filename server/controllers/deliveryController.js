const Delivery = require('../models/Delivery');
const FoodPost = require('../models/FoodPost'); // We may need this for some queries
const User = require('../models/User'); // We definitely need this for population

// @desc    Get aggregated stats for the logged-in volunteer
// @route   GET /api/deliveries/volunteer/stats
// @access  Private (Volunteer only)
exports.getVolunteerStats = async (req, res) => {
    try {
        // req.user is attached by our authMiddleware
        const volunteerId = req.user.id;

        const totalDeliveries = await Delivery.countDocuments({
            volunteer: volunteerId,
            status: 'Completed'
        });

        const activeDeliveries = await Delivery.countDocuments({
            volunteer: volunteerId,
            status: { $in: ['Accepted', 'In-Progress'] } // Status is either Accepted or In-Progress
        });

        // Placeholder logic for other stats as the backend doesn't track these yet.
        // In a real app, this might involve more complex calculations.
        const hoursVolunteered = totalDeliveries * 2; // Assuming 2 hours per delivery
        const mealsDelivered = totalDeliveries * 30; // Assuming 30 meals per delivery

        res.status(200).json({
            totalDeliveries,
            activeDeliveries,
            hoursVolunteered,
            mealsDelivered
        });

    } catch (error) {
        console.error('Error fetching volunteer stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all deliveries currently active for the logged-in volunteer
// @route   GET /api/deliveries/active
// @access  Private (Volunteer only)
exports.getActiveDeliveries = async (req, res) => {
    try {
        const activeDeliveries = await Delivery.find({
            volunteer: req.user.id,
            status: { $in: ['Accepted', 'In-Progress'] }
        })
        // Use .populate() to replace the IDs with actual data from other collections
        .populate({
            path: 'foodPost',
            select: 'title quantity' // Only get the title and quantity from the FoodPost
        })
        .populate({
            path: 'donor',
            select: 'name verificationDetails.address' // Get name and address from the User (donor)
        })
        .populate({
            path: 'ngo',
            select: 'name verificationDetails.address' // Get name and address from the User (ngo)
        });

        res.status(200).json(activeDeliveries);

    } catch (error) {
        console.error('Error fetching active deliveries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all available delivery jobs that are unassigned
// @route   GET /api/deliveries/available
// @access  Private (Volunteer only)
// In deliveryController.js
exports.getAvailableDeliveries = async (req, res) => {
    try {
        const availableDeliveries = await Delivery.find({ status: 'Pending' })
            .populate({ path: 'foodPost', select: 'title' })
            .populate({ path: 'donor', select: 'name verificationDetails' })
            .populate({ path: 'ngo', select: 'name verificationDetails' });

        res.status(200).json(availableDeliveries);
      } catch (error) {
        console.error('Error fetching available deliveries:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get notifications for the volunteer
// @route   GET /api/deliveries/notifications
// @access  Private (Volunteer only)
exports.getVolunteerNotifications = async (req, res) => {
    try {
        // --- Placeholder Implementation ---
        // In a real application, you would create a Notification model and fetch from there.
        // For now, we return mock data that matches the frontend's expectation.
        const mockNotifications = [
            { id: 1, title: 'New Delivery Available', body: 'A new delivery from Srinith\'s Cafe is ready.', time: '2 minutes ago', unread: true },
            { id: 2, title: 'Delivery Completed', body: 'You successfully delivered to Helping Hands.', time: '1 hour ago', unread: false }
        ];

        res.status(200).json(mockNotifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add this function to deliveryController.js

// @desc    A volunteer accepts a delivery job
// @route   PUT /api/deliveries/:id/accept
// @access  Private (Volunteer only)
exports.acceptDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        if (delivery.status !== 'Pending') return res.status(400).json({ message: 'Delivery no longer available' });

        delivery.volunteer = req.user.id;
        delivery.status = 'Accepted';

        const updatedDelivery = await delivery.save();

        // --- THIS IS THE FIX ---
        // We must populate the response so the frontend has all the info it needs.
        await updatedDelivery.populate([
            { path: 'foodPost', select: 'title' },
            { path: 'donor', select: 'name verificationDetails' },
            { path: 'ngo', select: 'name verificationDetails' }
        ]);

        res.status(200).json(updatedDelivery);

    } catch (error) {
        console.error('Error accepting delivery:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update the status of an active delivery
 * @route   PUT /api/deliveries/:id/status
 * @access  Private (Volunteer only)
 */
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const deliveryId = req.params.id;
        const volunteerId = req.user.id;

        // 1. Basic input validation
        const allowedStatuses = ['In-Progress', 'Completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update.' });
        }

        // 2. Find the delivery
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found.' });
        }

        // 3. Security check: Ensure the correct volunteer is updating it
        if (delivery.volunteer.toString() !== volunteerId) {
            return res.status(403).json({ message: 'User not authorized to update this delivery.' });
        }

        // 4. Business logic check: Prevent invalid status changes
        if (delivery.status === 'Completed') {
            return res.status(400).json({ message: 'Cannot change status of a completed delivery.' });
        }

        // 5. Update the delivery status and save
        delivery.status = status;
        const updatedDelivery = await delivery.save();

        // 6. --- THE CRITICAL LINK (UPDATED LOGIC) ---
        // This block now syncs the FoodPost status with the Delivery status.
        if (status === 'Completed') {
            // When delivery is finished, mark the food post as 'Delivered'.
            await FoodPost.findByIdAndUpdate(delivery.foodPost, { status: 'Delivered' });
        } else if (status === 'In-Progress') {
            // When delivery is picked up, mark the food post as 'In-Progress'.
            await FoodPost.findByIdAndUpdate(delivery.foodPost, { status: 'In-Progress' });
        }

        // 7. Populate the response with all necessary data for the frontend UI
        await updatedDelivery.populate([
            { path: 'foodPost', select: 'title' },
            { path: 'donor', select: 'name verificationDetails' },
            { path: 'ngo', select: 'name verificationDetails' }
        ]);

        res.status(200).json(updatedDelivery);

    } catch (error)
    {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};