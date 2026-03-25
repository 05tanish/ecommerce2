import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createReview, getProductReviews, updateReview, deleteReview } from '../controllers/reviewController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directory exists
const reviewUploadsDir = path.join(__dirname, '../uploads/reviews');
if (!fs.existsSync(reviewUploadsDir)) {
    fs.mkdirSync(reviewUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, reviewUploadsDir),
    filename: (req, file, cb) => cb(null, `review-${Date.now()}-${Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.post('/product/:id', auth, upload.array('images', 3), createReview);
router.put('/:id', auth, upload.array('images', 3), updateReview);
router.delete('/:id', auth, deleteReview);

export default router;
