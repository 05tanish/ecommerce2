import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import {
    markAttendance,
    getAllAttendance,
    getMyAttendance,
    getAttendanceStats
} from '../controllers/attendanceController.js';

const router = express.Router();

// All routes require auth
router.use(auth);

// Admin routes
router.post('/mark', role('admin'), markAttendance);
router.get('/all', role('admin'), getAllAttendance);
router.get('/stats', role('admin'), getAttendanceStats);

// Staff routes
router.get('/me', role('staff'), getMyAttendance);

export default router;
