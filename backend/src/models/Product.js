import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot be more than 100'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['handbags', 'wallets', 'accessories', 'jewelry', 'clothing', 'shoes', 'cosmetics', 'fragrances']
  },
  gender: {
    type: String,
    required: [true, 'Product gender is required'],
    enum: ['men', 'women', 'unisex']
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'Product SKU is required'],
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'Product images are required']
  }],
  primaryImage: {
    type: String,
    required: [true, 'Primary image is required']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true
    }
  }],
  specifications: {
    material: String,
    dimensions: String,
    weight: String,
    care: String,
    warranty: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discountPercentage > 0) {
    return this.price - (this.price * this.discountPercentage / 100);
  }
  return this.price;
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.stockQuantity > 0 || this.variants.some(v => v.stockQuantity > 0);
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  const variantStock = this.variants.reduce((total, variant) => total + variant.stockQuantity, 0);
  return this.stockQuantity + variantStock;
});

// Method to update view count
productSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return await this.save();
};

// Method to add review
productSchema.methods.addReview = async function(userId, rating, comment) {
  const review = {
    user: userId,
    rating,
    comment
  };
  
  this.reviews.push(review);
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.reviews.length;
  this.rating.count = this.reviews.length;
  
  return await this.save();
};

// Method to check if user has reviewed
productSchema.methods.hasUserReviewed = function(userId) {
  return this.reviews.some(review => review.user.toString() === userId.toString());
};

// Static method to get featured products
productSchema.statics.getFeatured = function() {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(8);
};

// Static method to get products on sale
productSchema.statics.getOnSale = function() {
  return this.find({ isActive: true, isOnSale: true })
    .sort({ discountPercentage: -1 })
    .limit(12);
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ isActive: true, category })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.search = function(query) {
  return this.find({
    isActive: true,
    $text: { $search: query }
  }).sort({ score: { $meta: 'textScore' } });
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product; 