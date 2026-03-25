import express from 'express';
import { getUsers, getUser, updateUserRole, toggleUserStatus, getUserStats, suspendUser, unsuspendUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';

const router = express.Router();

// Stats needs to come before /:id
router.get('/stats', getUserStats);

router.get('/', getUsers);
router.get('/:id', getUser);

router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);
router.put('/:id/suspend', auth, role('admin'), suspendUser);
router.put('/:id/unsuspend', auth, role('admin'), unsuspendUser);

export default router;

