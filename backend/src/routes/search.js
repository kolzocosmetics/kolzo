import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import logger from '../utils/logger.js';
import { redis } from '../config/redis.js';

const router = express.Router();

// Search products with advanced filtering
router.get('/products', [
  query('q').optional().trim().isLength({ min: 1 }).withMessage('Search query must not be empty'),
  query('category').optional().trim(),
  query('brand').optional().trim(),
  query('gender').optional().isIn(['men', 'women', 'unisex']).withMessage('Invalid gender'),
  query('price_min').optional().isNumeric().withMessage('Minimum price must be a number'),
  query('price_max').optional().isNumeric().withMessage('Maximum price must be a number'),
  query('sort').optional().isIn(['relevance', 'price_low', 'price_high', 'newest', 'popular']).withMessage('Invalid sort option'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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

    const {
      q = '',
      category,
      brand,
      gender,
      price_min,
      price_max,
      sort = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    // Build search query
    const searchQuery = {};
    const searchOptions = {};

    // Text search
    if (q) {
      searchQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    // Filters
    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    if (brand) {
      searchQuery.brand = { $regex: brand, $options: 'i' };
    }

    if (gender) {
      searchQuery.gender = gender;
    }

    if (price_min || price_max) {
      searchQuery.price = {};
      if (price_min) searchQuery.price.$gte = parseFloat(price_min);
      if (price_max) searchQuery.price.$lte = parseFloat(price_max);
    }

    // Stock filter (only show in-stock items)
    searchQuery['variants.stock'] = { $gt: 0 };

    // Sorting
    switch (sort) {
      case 'price_low':
        searchOptions.sort = { price: 1 };
        break;
      case 'price_high':
        searchOptions.sort = { price: -1 };
        break;
      case 'newest':
        searchOptions.sort = { createdAt: -1 };
        break;
      case 'popular':
        searchOptions.sort = { salesCount: -1 };
        break;
      default: // relevance
        if (q) {
          // For relevance, we'll use text score if query exists
          searchQuery.$text = { $search: q };
          searchOptions.sort = { score: { $meta: 'textScore' } };
        } else {
          searchOptions.sort = { createdAt: -1 };
        }
    }

    // Pagination
    searchOptions.skip = (parseInt(page) - 1) * parseInt(limit);
    searchOptions.limit = parseInt(limit);

    // Execute search
    const products = await Product.find(searchQuery, null, searchOptions);
    const total = await Product.countDocuments(searchQuery);

    // Track search analytics
    if (q) {
      await trackSearchAnalytics(q, req.ip, products.length);
    }

    // Cache results for 5 minutes
    const cacheKey = `search:${JSON.stringify(req.query)}`;
    await redis.setex(cacheKey, 300, JSON.stringify({ products, total }));

    res.json({
      success: true,
      data: {
        products,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Search suggestions
router.get('/suggestions', [
  query('q').trim().isLength({ min: 1 }).withMessage('Search query is required'),
  query('limit').optional().isInt({ min: 1, max: 10 }).withMessage('Limit must be between 1 and 10')
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

    const { q, limit = 5 } = req.query;

    // Get suggestions from multiple sources
    const suggestions = new Set();

    // Product name suggestions
    const nameSuggestions = await Product.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name')
    .limit(parseInt(limit))
    .lean();

    nameSuggestions.forEach(product => {
      const words = product.name.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.startsWith(q.toLowerCase()) && word.length > 2) {
          suggestions.add(word.charAt(0).toUpperCase() + word.slice(1));
        }
      });
    });

    // Category suggestions
    const categorySuggestions = await Product.distinct('category', {
      category: { $regex: q, $options: 'i' }
    });

    categorySuggestions.forEach(category => {
      suggestions.add(category);
    });

    // Brand suggestions
    const brandSuggestions = await Product.distinct('brand', {
      brand: { $regex: q, $options: 'i' }
    });

    brandSuggestions.forEach(brand => {
      suggestions.add(brand);
    });

    // Convert to array and limit results
    const suggestionArray = Array.from(suggestions).slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        suggestions: suggestionArray,
        query: q
      }
    });

  } catch (error) {
    logger.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search suggestions'
    });
  }
});

// Popular searches
router.get('/popular', async (req, res) => {
  try {
    // Get popular searches from Redis cache
    const popularSearches = await redis.zrevrange('popular_searches', 0, 9, 'WITHSCORES');
    
    const searches = [];
    for (let i = 0; i < popularSearches.length; i += 2) {
      searches.push({
        term: popularSearches[i],
        count: parseInt(popularSearches[i + 1])
      });
    }

    res.json({
      success: true,
      data: {
        searches
      }
    });

  } catch (error) {
    logger.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get popular searches'
    });
  }
});

// Search analytics tracking
async function trackSearchAnalytics(query, ip, resultCount) {
  try {
    // Increment search count in Redis
    await redis.zincrby('popular_searches', 1, query.toLowerCase());
    
    // Store search log
    const searchLog = {
      query: query.toLowerCase(),
      ip,
      resultCount,
      timestamp: new Date().toISOString()
    };

    await redis.lpush('search_logs', JSON.stringify(searchLog));
    await redis.ltrim('search_logs', 0, 999); // Keep last 1000 searches

    logger.info(`Search tracked: "${query}" - ${resultCount} results`);
  } catch (error) {
    logger.error('Search analytics error:', error);
  }
}

// Search history for authenticated users
router.get('/history', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const historyKey = `search_history:${req.user._id}`;
    const history = await redis.lrange(historyKey, 0, 19); // Last 20 searches

    const searchHistory = history.map(item => JSON.parse(item));

    res.json({
      success: true,
      data: {
        history: searchHistory
      }
    });

  } catch (error) {
    logger.error('Search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search history'
    });
  }
});

// Clear search history
router.delete('/history', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const historyKey = `search_history:${req.user._id}`;
    await redis.del(historyKey);

    res.json({
      success: true,
      message: 'Search history cleared'
    });

  } catch (error) {
    logger.error('Clear search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear search history'
    });
  }
});

export default router; 