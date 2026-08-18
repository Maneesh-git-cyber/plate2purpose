const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- Reusable Token Generation Function ---
// It's good practice to have this in a separate utils file, but for now, here is fine.
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will expire in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Signup Error:', error.message || error);
        res.status(500).json({ 
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by their email in the database
        const user = await User.findOne({ email });

        // 2. Check if the user exists AND if the entered password matches the hashed password
        if (user && (await user.matchPassword(password))) {
            // 3. If everything is correct, send back the user's data and a new token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                token: generateToken(user._id),
            });
        } else {
            // 4. If user doesn't exist or password is wrong, send an error
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current logged-in user's data
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        // --- THIS IS THE FIX ---
        // Instead of just sending req.user, we re-fetch the user from the DB.
        // This guarantees we get ALL fields, including verificationDetails.
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        // --- END OF FIX ---
    } catch (error) {
        console.error('GetMe Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

