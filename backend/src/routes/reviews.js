import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { redis } from '../config/redis.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', [
  param('productId').isMongoId().withMessage('Invalid product ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['newest', 'oldest', 'rating_high', 'rating_low', 'helpful']).withMessage('Invalid sort option'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', rating } = req.query;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build query
    const query = { product: productId, status: 'approved' };
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'rating_high':
        sortOptions = { rating: -1, createdAt: -1 };
        break;
      case 'rating_low':
        sortOptions = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOptions = { helpfulCount: -1, createdAt: -1 };
        break;
    }

    // Execute query
    const reviews = await Review.find(query)
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('user', 'name avatar')
      .lean();

    const total = await Review.countDocuments(query);

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      averageRating: avgRating[0]?.averageRating || 0,
      totalReviews: avgRating[0]?.totalReviews || 0,
      ratingDistribution: ratingStats
    };

    res.json({
      success: true,
      data: {
        reviews,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        stats
      }
    });

  } catch (error) {
    logger.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create a review
router.post('/', [
  authenticate,
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isURL().withMessage('Invalid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, rating, title, content, images = [] } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased the product (optional verification)
    // This could be enhanced with order verification

    // Create review
    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      title,
      content,
      images,
      status: 'pending', // Will be moderated
      createdAt: new Date()
    });

    await review.save();

    // Update product rating statistics
    await updateProductRatingStats(productId);

    // Log review creation
    logger.info(`Review created: ${review._id} for product ${productId} by user ${req.user._id}`);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and pending moderation',
      data: {
        review: {
          _id: review._id,
          rating,
          title,
          content,
          status: review.status,
          createdAt: review.createdAt
        }
      }
    });

  } catch (error) {
    logger.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

// Update a review
router.put('/:reviewId', [
  authenticate,
  param('reviewId').isMongoId().withMessage('Invalid review ID'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('content').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const updateData = req.body;

    // Find review and check ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Update review
    Object.assign(review, updateData);
    review.updatedAt = new Date();
    review.status = 'pending'; // Re-moderate after edit

    await review.save();

    // Update product rating statistics
    await updateProductRatingStats(review.product);

    res.json({
      success: true,
      message: 'Review updated successfully and pending moderation',
      data: { review }
    });

  } catch (error) {
    logger.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete a review
router.delete('/:reviewId', [
  authenticate,
  param('reviewId').isMongoId().withMessage('Invalid review ID')
], async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin rights
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    // Update product rating statistics
    await updateProductRatingStats(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    logger.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', [
  authenticate,
  param('reviewId').isMongoId().withMessage('Invalid review ID')
], async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked as helpful
    const helpfulKey = `helpful:${reviewId}:${req.user._id}`;
    const alreadyHelpful = await redis.get(helpfulKey);

    if (alreadyHelpful) {
      // Remove helpful mark
      await redis.del(helpfulKey);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      await review.save();

      res.json({
        success: true,
        message: 'Helpful mark removed',
        data: { helpfulCount: review.helpfulCount }
      });
    } else {
      // Add helpful mark
      await redis.setex(helpfulKey, 86400 * 365, '1'); // Store for 1 year
      review.helpfulCount += 1;
      await review.save();

      res.json({
        success: true,
        message: 'Review marked as helpful',
        data: { helpfulCount: review.helpfulCount }
      });
    }

  } catch (error) {
    logger.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful'
    });
  }
});

// Admin: Moderate reviews
router.patch('/:reviewId/moderate', [
  authenticate,
  authorize(['admin']),
  param('reviewId').isMongoId().withMessage('Invalid review ID'),
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid status'),
  body('reason').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Reason must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { status, reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    review.moderatedBy = req.user._id;
    review.moderatedAt = new Date();
    if (reason) review.rejectionReason = reason;

    await review.save();

    // Update product rating statistics if approved
    if (status === 'approved') {
      await updateProductRatingStats(review.product);
    }

    logger.info(`Review ${reviewId} moderated to ${status} by ${req.user._id}`);

    res.json({
      success: true,
      message: `Review ${status}`,
      data: { review }
    });

  } catch (error) {
    logger.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate review'
    });
  }
});

// Get user's reviews
router.get('/user/me', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('product', 'name images price')
      .lean();

    const total = await Review.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        reviews,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews'
    });
  }
});

// Update product rating statistics
async function updateProductRatingStats(productId) {
  try {
    const stats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      const distribution = {};
      stat.ratingDistribution.forEach(rating => {
        distribution[rating] = (distribution[rating] || 0) + 1;
      });

      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(stat.averageRating * 10) / 10,
        totalReviews: stat.totalReviews,
        ratingDistribution: distribution
      });
    }
  } catch (error) {
    logger.error('Update product rating stats error:', error);
  }
}

export default router; 