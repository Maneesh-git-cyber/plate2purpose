const express = require('express');
const router = express.Router();

// Import the controller functions
const { signup, login, getMe } = require('../controllers/authController');

// Import our security guard
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private route - This is the one we are adding
router.get('/me', protect, getMe);

module.exports = router;