const express = require('express');
const router = express.Router();
const multer = require('multer');

// Use memory storage for Render (prevents crashes)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { getProducts, addProduct, editProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);

// ⚠️ THIS IS THE LINE YOU MUST HAVE: upload.array('images', 10) ⚠️
router.post('/', upload.array('images', 10), addProduct); 

// We also need to add multer to the PUT route for editing
router.put('/:id', upload.array('images', 10), editProduct);

router.delete('/:id', deleteProduct);

module.exports = router;