import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import {
    getCategories, getCategory,
    createCategory, updateCategory, deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Public
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin only
router.post('/', auth, role('admin'), createCategory);
router.put('/:id', auth, role('admin'), updateCategory);
router.delete('/:id', auth, role('admin'), deleteCategory);

export default router;
