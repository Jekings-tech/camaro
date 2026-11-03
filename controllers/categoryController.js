const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new category (with image)
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Category image is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'iroc_categories'
    });

    const newCategory = new Category({ 
      name,
      image: result.secure_url 
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a category
exports.editCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update name
    if (name) category.name = name;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'iroc_categories'
      });
      category.image = result.secure_url;
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};