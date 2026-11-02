const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  generation: {
    type: String,
    required: true,
    // We will pass the exact strings like "Camaro Gen 4 (1993-2002)" from the frontend dropdown
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  originalPrice: {
    type: Number,
    required: true // The higher price that gets slashed out
  },
  salePrice: {
    type: Number,
    required: true // The real price
  },
  images: {
    type: [String], // Array of Cloudinary URLs
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);