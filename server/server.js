// This is the main entry point for our backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows requests from our frontend
app.use(express.json()); // Allows us to accept JSON data in the body

// A simple test route to make sure the server is alive
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// --- DEFINE ROUTES HERE ---
// When a request comes in to /api/auth, we will pass it to our authRoutes file
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
// We will add more routes here later (e.g., for food posts)
// app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

