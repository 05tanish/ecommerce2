import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBanner, getBanners, updateBanner, deleteBanner, toggleBannerStatus } from '../controllers/bannerController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const router = express.Router();

router.post('/', auth, role('admin'), upload.single('image'), createBanner);
router.get('/', getBanners);
router.put('/:id', auth, role('admin'), upload.single('image'), updateBanner);
router.delete('/:id', auth, role('admin'), deleteBanner);
router.put('/:id/toggle', auth, role('admin'), toggleBannerStatus);

export default router;
