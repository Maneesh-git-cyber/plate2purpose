const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Exit the process with failure if we can't connect to the DB
        process.exit(1);
    }
};

module.exports = connectDB;

// this file is done , no one needs to touch it 