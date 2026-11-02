const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars FIRST (before importing routes that might need them)
dotenv.config();

// Import Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// --- MIDDLEWARE ---
// Allow cross-origin requests (from your frontend dashboard to this backend)
app.use(cors());

// Parse JSON bodies (for login and standard API requests)
app.use(express.json());

// Parse URL-encoded bodies (CRITICAL for handling HTML form submissions with files)
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder statically (optional, but good if you want to view temp files)
// Note: In production, Cloudinary stores the images, so this is just for local dev
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- ROUTES ---
// Hardcoded Simple Login (No database, no JWT complexity)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'camaro' && password === 'camaro123') {
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token-just-for-frontend' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Mount the category and product routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Base route for testing if the server is running
app.get('/', (req, res) => {
  res.send('IROC Backend API is running...');
});


// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });