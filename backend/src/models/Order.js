import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    selectedSize: String,
    selectedColor: String
  }],
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'cod', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  notes: [{
    note: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: Number,
  refundReason: String,
  refundedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order summary
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order status timeline
orderSchema.virtual('statusTimeline').get(function() {
  const timeline = [
    {
      status: 'pending',
      timestamp: this.createdAt,
      description: 'Order placed'
    }
  ];

  if (this.orderStatus === 'processing') {
    timeline.push({
      status: 'processing',
      timestamp: this.updatedAt,
      description: 'Order being processed'
    });
  }

  if (this.orderStatus === 'shipped') {
    timeline.push({
      status: 'shipped',
      timestamp: this.updatedAt,
      description: 'Order shipped',
      trackingNumber: this.trackingNumber
    });
  }

  if (this.orderStatus === 'delivered') {
    timeline.push({
      status: 'delivered',
      timestamp: this.updatedAt,
      description: 'Order delivered'
    });
  }

  if (this.orderStatus === 'cancelled') {
    timeline.push({
      status: 'cancelled',
      timestamp: this.cancelledAt,
      description: 'Order cancelled',
      reason: this.cancellationReason
    });
  }

  return timeline;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    this.orderNumber = `KOLZO-${year}${month}${day}-${sequence}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, note = '') {
  this.orderStatus = newStatus;
  
  if (note) {
    this.notes.push({ note });
  }
  
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return await this.save();
};

// Method to add tracking number
orderSchema.methods.addTracking = async function(trackingNumber, estimatedDelivery) {
  this.trackingNumber = trackingNumber;
  this.estimatedDelivery = estimatedDelivery;
  this.orderStatus = 'shipped';
  
  this.notes.push({
    note: `Tracking number added: ${trackingNumber}`
  });
  
  return await this.save();
};

// Method to process refund
orderSchema.methods.processRefund = async function(amount, reason) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  this.paymentStatus = 'refunded';
  
  this.notes.push({
    note: `Refund processed: ₹${amount} - ${reason}`
  });
  
  return await this.save();
};

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('items.product')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ orderStatus: status })
    .populate('user', 'name email')
    .populate('items.product')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get order statistics
orderSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }
    }
  ]);
};

// Static method to get orders by date range
orderSchema.statics.getByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('user', 'name email')
  .populate('items.product')
  .sort({ createdAt: -1 });
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 