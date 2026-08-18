const express = require('express');
const router = express.Router();

const { submitVerification } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. A user MUST be logged in to submit their details.
router.route('/submit-verification').post(protect, submitVerification);

module.exports = router;