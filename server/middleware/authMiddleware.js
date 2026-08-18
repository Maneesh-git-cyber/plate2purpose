const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This is our "Protect" middleware
exports.protect = async (req, res, next) => {
    let token;

    // Check if the request's authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1Ni...")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using our JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user from the ID in the token and attach them to the request object.
            // We exclude the password field when we fetch the user.
            req.user = await User.findById(decoded.id).select('-password');
            
            // 4. Call "next()" to pass the request to the next step in the chain (e.g., the role middleware or the final controller).
            next();

        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If there's no token at all
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};