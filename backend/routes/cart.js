import express from 'express';
import auth from '../middleware/auth.js';
import {
    getCart, addToCart, updateCartItem,
    removeFromCart, clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require auth (user only)
router.use(auth);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);

export default router;
