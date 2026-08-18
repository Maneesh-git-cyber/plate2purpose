const User = require('../models/User');

// @desc    User submits their verification details
// @route   POST /api/users/submit-verification
// @access  Private (User must be logged in)
exports.submitVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // --- THIS IS THE FIX ---
        // Instead of replacing the object, we merge the new details into it.
        // This ensures that if a user submits a phone number first, and then an
        // address later, the phone number is not erased.
        user.verificationDetails = { ...user.verificationDetails, ...req.body };
        
        await user.save();
        res.status(200).json({ message: 'Verification details submitted successfully.' });

    } catch (error) {
        console.error('Error submitting verification:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};