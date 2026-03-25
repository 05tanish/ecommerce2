import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import { createNotification, getNotifications, broadcastNotification, deleteNotification, getUserNotifications, markAllAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/user', auth, getUserNotifications);
router.put('/user/read-all', auth, markAllAsRead);

router.post('/', auth, role('admin'), createNotification);
router.get('/', auth, role('admin'), getNotifications);
router.put('/:id/send', auth, role('admin'), broadcastNotification);
router.delete('/:id', auth, role('admin'), deleteNotification);

export default router;

