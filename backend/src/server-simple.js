import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KOLZO API is running (Simple Mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working!',
    data: {
      timestamp: new Date().toISOString(),
      environment: 'development'
    }
  });
});

// Newsletter test endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, firstName, lastName } = req.body;
  
  console.log('Newsletter subscription:', { email, firstName, lastName });
  
  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter (Test Mode)',
    data: {
      email,
      subscriberId: 'test-' + Date.now()
    }
  });
});

// Search test endpoint
app.get('/api/search/products', (req, res) => {
  const { q } = req.query;
  
  console.log('Search query:', q);
  
  // Mock search results
  const mockProducts = [
    {
      _id: '1',
      name: 'Luxury Handbag',
      price: 2500,
      brand: 'Kolzo',
      category: 'Handbags',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
      featured: true
    },
    {
      _id: '2',
      name: 'Designer Wallet',
      price: 800,
      brand: 'Kolzo',
      category: 'Wallets',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'],
      featured: false
    }
  ];
  
  res.json({
    success: true,
    data: {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Products test endpoint
app.get('/api/products/featured', (req, res) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Luxury Handbag',
      price: 2500,
      brand: 'Kolzo',
      category: 'Handbags',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
      featured: true
    },
    {
      _id: '2',
      name: 'Designer Wallet',
      price: 800,
      brand: 'Kolzo',
      category: 'Wallets',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'],
      featured: true
    }
  ];
  
  res.json({
    success: true,
    data: mockProducts
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 KOLZO Simple Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}/api`);
}); 