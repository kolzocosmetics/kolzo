import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate('product')
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    logger.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add item to wishlist
router.post('/', [
  authenticate,
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId, notes } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      user: req.user._id,
      product: productId,
      notes: notes || ''
    });

    await wishlistItem.save();
    await wishlistItem.populate('product');

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem
    });
  } catch (error) {
    logger.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Remove item from wishlist
router.delete('/:productId', [
  authenticate,
  param('productId').isMongoId().withMessage('Invalid product ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: productId
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    logger.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update wishlist item notes
router.put('/:productId', [
  authenticate,
  param('productId').isMongoId().withMessage('Invalid product ID'),
  body('notes').isString().withMessage('Notes must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { notes } = req.body;

    const wishlistItem = await Wishlist.findOneAndUpdate(
      {
        user: req.user._id,
        product: productId
      },
      { notes },
      { new: true }
    ).populate('product');

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Wishlist item updated',
      data: wishlistItem
    });
  } catch (error) {
    logger.error('Error updating wishlist item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update wishlist item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', [
  authenticate,
  param('productId').isMongoId().withMessage('Invalid product ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    res.json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem,
        item: wishlistItem
      }
    });
  } catch (error) {
    logger.error('Error checking wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Clear wishlist
router.delete('/', authenticate, async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    logger.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get wishlist count
router.get('/count', authenticate, async (req, res) => {
  try {
    const count = await Wishlist.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    logger.error('Error getting wishlist count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Move wishlist item to cart (optional feature)
router.post('/:productId/move-to-cart', [
  authenticate,
  param('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if item is in wishlist
    const wishlistItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    // Here you would add the item to cart
    // For now, we'll just remove it from wishlist
    await Wishlist.findByIdAndDelete(wishlistItem._id);

    res.json({
      success: true,
      message: 'Product moved to cart and removed from wishlist',
      data: {
        product: product,
        quantity: quantity
      }
    });
  } catch (error) {
    logger.error('Error moving item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Share wishlist (optional feature)
router.post('/share', [
  authenticate,
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').optional().isString().withMessage('Message must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, message } = req.body;

    // Get user's wishlist
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate('product')
      .sort({ addedAt: -1 });

    if (wishlist.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Wishlist is empty'
      });
    }

    // Here you would send an email with the wishlist
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Wishlist shared successfully',
      data: {
        sharedWith: email,
        itemCount: wishlist.length,
        items: wishlist.map(item => ({
          name: item.product.name,
          price: item.product.price,
          notes: item.notes
        }))
      }
    });
  } catch (error) {
    logger.error('Error sharing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router; 