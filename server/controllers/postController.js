const FoodPost = require('../models/FoodPost');
const Delivery = require('../models/Delivery');
// @desc    Create a new food post
// @route   POST /api/posts
// @access  Private (Donor only)
exports.createPost = async (req, res) => {
    try {
        // Get the data from the request body
        const { title, quantity, pickupLocation } = req.body;

        // Get the logged-in user's ID from the token (attached by `protect` middleware)
        const donorId = req.user.id;

        // Create a new post document in the database
        const newPost = await FoodPost.create({
            title,
            quantity,
            pickupLocation,
            donor: donorId // Link the post to the logged-in donor
        });

        // Send back the full, newly created post object (including its _id)
        res.status(201).json(newPost);

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all posts created by the logged-in donor
// @route   GET /api/posts/me/donations
// @access  Private (Donor only)
exports.getMyDonations = async (req, res) => {
    try {
        // Find all food posts where the 'donor' field matches the logged-in user's ID
        const posts = await FoodPost.find({ donor: req.user.id })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching donor posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get all posts that are currently available
// @route   GET /api/posts/available
// @access  Private (NGO only)
exports.getAllAvailablePosts = async (req, res) => {
    try {
        // Find all food posts where the 'status' is 'Available'
        const posts = await FoodPost.find({ status: 'Available' })
            .populate({
                path: 'donor',
                select: 'name verificationDetails.businessName' // Get the donor's name
            })
            .sort({ createdAt: -1 }); // Show the newest posts first

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching available posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    An NGO claims an available food post
// @route   PUT /api/posts/claim/:id
// @access  Private (NGO only)
exports.claimPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const ngoUser = req.user; // The logged-in NGO from the 'protect' middleware

        const post = await FoodPost.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Food post not found.' });
        }

        // Check if the post is still available
        if (post.status !== 'Available') {
            return res.status(400).json({ message: 'This post is no longer available.' });
        }

        // Update the food post
        post.status = 'Claimed';
        post.claimedBy = ngoUser._id;
        const updatedPost = await post.save();

        // --- CRITICAL STEP: Create the corresponding Delivery document ---
        await Delivery.create({
            foodPost: updatedPost._id,
            donor: updatedPost.donor,
            ngo: updatedPost.claimedBy,
            status: 'Pending' // This creates the "Available Job" for volunteers
        });

        res.status(200).json(updatedPost);

    } catch (error) {
        console.error('Error claiming post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get all posts claimed by the logged-in NGO
// @route   GET /api/posts/me/claims
// @access  Private (NGO only)
exports.claimPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const ngoUser = req.user;
        const { transportMethod } = req.body; // <-- Get the choice from the frontend

        const post = await FoodPost.findById(postId);
        if (!post) return res.status(404).json({ message: 'Food post not found.' });
        if (post.status !== 'Available') return res.status(400).json({ message: 'This post is no longer available.' });

        // Update the post regardless of the choice
        post.status = 'Claimed';
        post.claimedBy = ngoUser._id;
        const updatedPost = await post.save();

        // --- THIS IS THE CRITICAL LOGIC ---
        // Only create a Delivery job if the NGO requested a driver.
        if (transportMethod === 'driver') {
            await Delivery.create({
                foodPost: updatedPost._id,
                donor: updatedPost.donor,
                ngo: updatedPost.claimedBy,
                status: 'Pending' 
            });
        }

        res.status(200).json(updatedPost);

    } catch (error) {
        console.error('Error claiming post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all posts claimed by the logged-in NGO
// @route   GET /api/posts/me/claims
// @access  Private (NGO only)
exports.getClaimedPosts = async (req, res) => {
    try {
        const posts = await FoodPost.find({ claimedBy: req.user.id })
            .populate({ path: 'donor', select: 'name' })
            .sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching claimed posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};