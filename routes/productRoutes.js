const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getProducts, 
  addProduct, 
  editProduct, 
  deleteProduct 
} = require('../controllers/productController');

// Setup multer for temporary file storage before sending to Cloudinary
const upload = multer({ dest: 'uploads/' });

router.get('/', getProducts);
// 'images' is the field name we will use in our FormData on the frontend
router.post('/', upload.array('images', 5), addProduct); 
router.put('/:id', editProduct);
router.delete('/:id', deleteProduct);

module.exports = router;