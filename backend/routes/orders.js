import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import {
    createOrder, getOrders, getOrder,
    updateOrderStatus, getOrderStats,
    processRefund, updateTracking, requestReturn
} from '../controllers/orderController.js';

const router = express.Router();

// Stats (admin/staff) — must be before :id route
router.get('/stats', auth, role('admin', 'staff'), getOrderStats);

// User creates order
router.post('/', auth, createOrder);

// List orders (user sees own, admin/staff see all)
router.get('/', auth, getOrders);

// Get single order
router.get('/:id', auth, getOrder);

// Update status (admin/staff)
router.put('/:id/status', auth, role('admin', 'staff'), updateOrderStatus);

// Refund handling (admin)
router.put('/:id/refund', auth, role('admin'), processRefund);

// Tracking update (admin/staff)
router.put('/:id/tracking', auth, role('admin', 'staff'), updateTracking);

// User requests return
router.put('/:id/request-return', auth, requestReturn);

export default router;

