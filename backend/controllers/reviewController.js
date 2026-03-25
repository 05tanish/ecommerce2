import Review from '../models/Review.js';

// GET /api/reviews/product/:id
// Get all reviews for a specific product
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // Calculate aggregate
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        res.json({ reviews, stats: { totalReviews, averageRating } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/reviews/product/:id
// Create a new review
export const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        // Check for existing review
        const existingReview = await Review.findOne({ product: productId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Handle image uploads
        const images = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                images.push(`/uploads/reviews/${file.filename}`);
            });
        }

        const review = new Review({
            product: productId,
            user: req.user._id,
            rating: Number(rating),
            comment,
            images
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/reviews/:id
// Update user's own review
export const updateReview = async (req, res) => {
    try {
        const { rating, comment, existingImages } = req.body;

        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Check ownership
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to edit this review' });
        }

        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment;

        // Handle images
        let updatedImages = [];
        // Keep existing ones user didn't delete (passed as string array from frontend)
        if (existingImages) {
            updatedImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        } else if (req.body.existingImages === '') {
            // User deleted all existing images
            updatedImages = [];
        } else {
            // If not provided in request to change them, keep unmodified
            updatedImages = [...review.images];
        }

        // Add new uploads
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                updatedImages.push(`/uploads/reviews/${file.filename}`);
            });
        }
        review.images = updatedImages;

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/reviews/:id
// Delete a review (user's own or admin)
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await Review.deleteOne({ _id: req.params.id });
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
