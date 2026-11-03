const express = require('express');
const router = express.Router();
const multer = require('multer');

// FIX 1: Use memory storage to prevent crashes on Render's ephemeral disk
const storage = multer.memoryStorage();

// FIX 2: Setup multer to accept multiple files under the 'images' field
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB per image (optional)
});

const { getProducts, addProduct, editProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);

// FIX 3: Use upload.array('images', 5) instead of upload.single or upload.any
// This tells Multer "Expect multiple files in the 'images' field, up to 5"
router.post('/', upload.array('images', 5), addProduct); 

router.put('/:id', editProduct);
router.delete('/:id', deleteProduct);

module.exports = router;