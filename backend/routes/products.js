import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import upload from '../middleware/upload.js';
import {
    getProducts, getAllProducts, getProduct,
    createProduct, updateProduct, deleteProduct,
    toggleProductStatus, getTrending, getAutoSuggest, getAllTags
} from '../controllers/productController.js';

const router = express.Router();

// Public — discovery endpoints (must be BEFORE /:id)
router.get('/trending', getTrending);
router.get('/suggest', getAutoSuggest);
router.get('/tags', getAllTags);

// Public — list & detail
router.get('/', getProducts);
router.get('/all', auth, role('admin', 'staff'), getAllProducts);
router.get('/:id', getProduct);

// Admin/Staff — CRUD
router.post('/', auth, role('admin', 'staff'), upload.single('image'), createProduct);
router.put('/:id', auth, role('admin', 'staff'), upload.single('image'), updateProduct);
router.delete('/:id', auth, role('admin'), deleteProduct);
router.put('/:id/status', auth, role('admin'), toggleProductStatus);

export default router;
