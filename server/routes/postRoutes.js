const express = require('express');
const router = express.Router();

// Import the controller logic
const { 
    createPost,
    getMyDonations,
    getAllAvailablePosts ,
    claimPost,
    getClaimedPosts
} = require('../controllers/postController');

// Import our security middleware
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// --- EXISTING ROUTES ---
router.route('/').post(protect, authorize('DONOR'), createPost);
router.route('/me/donations').get(protect, authorize('DONOR'), getMyDonations);
router.route('/available').get(protect, authorize('NGO'), getAllAvailablePosts);
router.route('/claim/:id').put(protect, authorize('NGO'), claimPost);
router.route('/me/claims').get(protect, authorize('NGO'), getClaimedPosts);

module.exports = router;