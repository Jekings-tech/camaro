const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (Make sure these are in your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new product (with images)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, generation, category, originalPrice, salePrice } = req.body;
    
    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'iroc_parts'
      });
      imageUrls.push(result.secure_url);
    }

    const newProduct = new Product({
      name,
      description,
      generation,
      category,
      originalPrice,
      salePrice,
      images: imageUrls // The first image in this array will act as the thumbnail
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a product
exports.editProduct = async (req, res) => {
  try {
    const { name, description, generation, category, originalPrice, salePrice } = req.body;
    
    // Find the existing product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If new images are uploaded, upload them to Cloudinary. Otherwise, keep the old ones.
    let imageUrls = product.images;
    if (req.files && req.files.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'iroc_parts'
        });
        imageUrls.push(result.secure_url);
      }
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.generation = generation || product.generation;
    product.category = category || product.category;
    product.originalPrice = originalPrice || product.originalPrice;
    product.salePrice = salePrice || product.salePrice;
    product.images = imageUrls;

    // Save to database
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};