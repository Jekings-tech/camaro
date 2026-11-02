const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  addCategory, 
  editCategory, 
  deleteCategory 
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', addCategory);
router.put('/:id', editCategory);
router.delete('/:id', deleteCategory);

module.exports = router;