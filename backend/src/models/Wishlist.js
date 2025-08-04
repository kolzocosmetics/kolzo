import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-product combinations
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

// Indexes for better query performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ addedAt: -1 });

// Virtual for product details
wishlistSchema.virtual('productDetails').get(function() {
  return this.populated('product') ? this.product : null;
});

// Virtual for user details
wishlistSchema.virtual('userDetails').get(function() {
  return this.populated('user') ? this.user : null;
});

// Method to update notes
wishlistSchema.methods.updateNotes = async function(notes) {
  this.notes = notes;
  return await this.save();
};

// Static method to get user's wishlist
wishlistSchema.statics.getByUser = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.populate) {
    return this.find(query)
      .populate('product')
      .sort({ addedAt: -1 });
  }
  
  return this.find(query).sort({ addedAt: -1 });
};

// Static method to check if product is in user's wishlist
wishlistSchema.statics.isInWishlist = function(userId, productId) {
  return this.exists({ user: userId, product: productId });
};

// Static method to get wishlist count for user
wishlistSchema.statics.getCount = function(userId) {
  return this.countDocuments({ user: userId });
};

// Static method to get wishlist by category
wishlistSchema.statics.getByCategory = function(userId, category) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: { category: category, isActive: true }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist by brand
wishlistSchema.statics.getByBrand = function(userId, brand) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: { brand: brand, isActive: true }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist statistics
wishlistSchema.statics.getStats = function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalValue: { $sum: '$product.price' },
        averagePrice: { $avg: '$product.price' },
        categories: { $addToSet: '$product.category' },
        brands: { $addToSet: '$product.brand' }
      }
    }
  ]);
};

// Static method to get popular wishlist items
wishlistSchema.statics.getPopularItems = function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$product',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        product: 1,
        wishlistCount: '$count'
      }
    }
  ]);
};

// Static method to get wishlist by date range
wishlistSchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    addedAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('product')
  .sort({ addedAt: -1 });
};

// Static method to get wishlist with price range
wishlistSchema.statics.getByPriceRange = function(userId, minPrice, maxPrice) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        price: { $gte: minPrice, $lte: maxPrice },
        isActive: true
      }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist with availability filter
wishlistSchema.statics.getByAvailability = function(userId, inStock = true) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        isActive: true,
        $or: [
          { stockQuantity: { $gt: 0 } },
          { 'variants.stockQuantity': { $gt: 0 } }
        ]
      }
    })
    .then(items => {
      if (inStock) {
        return items.filter(item => item.product);
      } else {
        return items.filter(item => !item.product);
      }
    });
};

// Static method to get wishlist with sale items
wishlistSchema.statics.getSaleItems = function(userId) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        isActive: true,
        $or: [
          { discountPercentage: { $gt: 0 } },
          { isOnSale: true }
        ]
      }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist with new arrivals
wishlistSchema.statics.getNewArrivals = function(userId, days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        isActive: true,
        createdAt: { $gte: date }
      }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist with featured items
wishlistSchema.statics.getFeaturedItems = function(userId) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        isActive: true,
        isFeatured: true
      }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist with search
wishlistSchema.statics.search = function(userId, searchTerm) {
  return this.find({ user: userId })
    .populate({
      path: 'product',
      match: {
        isActive: true,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    })
    .then(items => items.filter(item => item.product));
};

// Static method to get wishlist with sorting
wishlistSchema.statics.getSorted = function(userId, sortBy = 'addedAt', sortOrder = 'desc') {
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  return this.find({ user: userId })
    .populate('product')
    .sort(sortOptions);
};

// Ensure virtual fields are serialized
wishlistSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist; 