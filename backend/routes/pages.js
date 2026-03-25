import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import { createPage, getPages, getPageBySlug, updatePage, deletePage } from '../controllers/pageController.js';

const router = express.Router();

// Public route must be defined separately from parameterized ones if they clash, 
// but here /slug and / (all) are fine. We will put public GET by slug below all.
router.get('/', auth, role('admin'), getPages);
router.post('/', auth, role('admin'), createPage);
router.put('/:id', auth, role('admin'), updatePage);
router.delete('/:id', auth, role('admin'), deletePage);

// Public route for storefront to fetch a page by its slug
router.get('/:slug', getPageBySlug);

export default router;
