import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import { createCoupon, getCoupons, updateCoupon, deleteCoupon, toggleCouponStatus, getActiveCoupons } from '../controllers/couponController.js';

const router = express.Router();

router.get('/active', getActiveCoupons);

router.post('/', auth, role('admin'), createCoupon);
router.get('/', auth, role('admin'), getCoupons);
router.put('/:id', auth, role('admin'), updateCoupon);
router.delete('/:id', auth, role('admin'), deleteCoupon);
router.put('/:id/toggle', auth, role('admin'), toggleCouponStatus);

export default router;

