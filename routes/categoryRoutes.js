const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getCategories, addCategory, editCategory, deleteCategory } = require('../controllers/categoryController');

const upload = multer({ dest: 'uploads/' });

router.get('/', getCategories);
// 'image' is the field name we will use in the FormData
router.post('/', upload.single('image'), addCategory); 
router.put('/:id', upload.single('image'), editCategory); // Added multer here so you can edit images
router.delete('/:id', deleteCategory);

module.exports = router;