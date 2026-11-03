const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');

// Load env vars FIRST
dotenv.config();

// Import Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());

// Parse JSON bodies (for login and standard API requests)
app.use(express.json());

// ❌ REMOVED: app.use(express.urlencoded({ extended: true })); 
// This was breaking your Multer uploads!

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- ROUTES ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'camaro' && password === 'camaro123') {
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token-just-for-frontend' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/checkout', async (req, res) => {
    const { customer, items, total } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fbodyguyparts@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });

    let itemsHtml = items.map(i => `<li>${i.name} - $${i.price}</li>`).join('');
    
    const mailOptions = {
        from: 'fbodyguyparts@gmail.com',
        to: 'fbodyguyparts@gmail.com',
        subject: `NEW ORDER from ${customer.name}`,
        html: `
            <h2>New Order Received</h2>
            <p><strong>Customer:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <h3>Items:</h3>
            <ul>${itemsHtml}</ul>
            <h3>Total: $${total.toFixed(2)}</h3>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Order placed and email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// Mount the category and product routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('F-Body Backend API is running...');
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