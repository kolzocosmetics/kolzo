import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Sample product data
const sampleProducts = [
  {
    name: "Luxury Leather Handbag",
    slug: "luxury-leather-handbag",
    description: "Premium leather handbag with elegant design and spacious interior. Perfect for everyday use and special occasions.",
    price: 25000,
    originalPrice: 30000,
    discountPercentage: 16.67,
    category: "handbags",
    gender: "women",
    brand: "KOLZO",
    sku: "HB001",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    primaryImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    variants: [
      {
        name: "Black",
        color: "Black",
        size: "Standard",
        price: 25000,
        stockQuantity: 15
      },
      {
        name: "Brown",
        color: "Brown",
        size: "Standard",
        price: 25000,
        stockQuantity: 10
      }
    ],
    stockQuantity: 25,
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    seoTitle: "Luxury Leather Handbag - Premium Quality | KOLZO",
    seoDescription: "Discover our premium leather handbag collection. Elegant design, spacious interior, perfect for everyday use.",
    seoKeywords: "leather handbag, luxury bag, premium handbag, designer bag"
  },
  {
    name: "Designer Wallet",
    slug: "designer-wallet",
    description: "Sleek and functional designer wallet with multiple card slots and coin compartment. Made from premium materials.",
    price: 8500,
    originalPrice: 10000,
    discountPercentage: 15,
    category: "accessories",
    gender: "unisex",
    brand: "KOLZO",
    sku: "AC001",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500"
    ],
    primaryImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    variants: [
      {
        name: "Black",
        color: "Black",
        size: "Standard",
        price: 8500,
        stockQuantity: 20
      },
      {
        name: "Brown",
        color: "Brown",
        size: "Standard",
        price: 8500,
        stockQuantity: 15
      }
    ],
    stockQuantity: 35,
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    seoTitle: "Designer Wallet - Premium Quality | KOLZO",
    seoDescription: "Premium designer wallet with multiple card slots. Sleek design and functional features.",
    seoKeywords: "designer wallet, premium wallet, leather wallet, card holder"
  },
  {
    name: "Luxury Lipstick Set",
    slug: "luxury-lipstick-set",
    description: "Premium lipstick set with long-lasting formula and rich pigmentation. Includes 5 stunning shades.",
    price: 12000,
    originalPrice: 15000,
    discountPercentage: 20,
    category: "makeup",
    gender: "women",
    brand: "KOLZO Beauty",
    sku: "MK001",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"
    ],
    primaryImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
    variants: [
      {
        name: "Classic Red",
        color: "Red",
        size: "Standard",
        price: 12000,
        stockQuantity: 30
      },
      {
        name: "Nude Pink",
        color: "Pink",
        size: "Standard",
        price: 12000,
        stockQuantity: 25
      }
    ],
    stockQuantity: 55,
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    seoTitle: "Luxury Lipstick Set - Premium Quality | KOLZO Beauty",
    seoDescription: "Premium lipstick set with long-lasting formula. Rich pigmentation and stunning shades.",
    seoKeywords: "luxury lipstick, premium makeup, lipstick set, beauty products"
  },
  {
    name: "Premium Watch",
    slug: "premium-watch",
    description: "Elegant premium watch with precision movement and sophisticated design. Perfect for formal occasions.",
    price: 45000,
    originalPrice: 55000,
    discountPercentage: 18.18,
    category: "watches",
    gender: "unisex",
    brand: "KOLZO",
    sku: "WT001",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500"
    ],
    primaryImage: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
    variants: [
      {
        name: "Silver",
        color: "Silver",
        size: "Standard",
        price: 45000,
        stockQuantity: 8
      },
      {
        name: "Gold",
        color: "Gold",
        size: "Standard",
        price: 45000,
        stockQuantity: 5
      }
    ],
    stockQuantity: 13,
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    seoTitle: "Premium Watch - Elegant Design | KOLZO",
    seoDescription: "Elegant premium watch with precision movement. Sophisticated design for formal occasions.",
    seoKeywords: "premium watch, luxury watch, elegant watch, formal watch"
  },
  {
    name: "Designer Perfume",
    slug: "designer-perfume",
    description: "Exclusive designer perfume with unique fragrance notes. Long-lasting scent for sophisticated individuals.",
    price: 18000,
    originalPrice: 22000,
    discountPercentage: 18.18,
    category: "fragrances",
    gender: "unisex",
    brand: "KOLZO",
    sku: "FR001",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
      "https://images.unsplash.com/photo-1587017539504-b7550d866830?w=500"
    ],
    primaryImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
    variants: [
      {
        name: "Classic",
        color: "Clear",
        size: "100ml",
        price: 18000,
        stockQuantity: 12
      },
      {
        name: "Intense",
        color: "Clear",
        size: "50ml",
        price: 12000,
        stockQuantity: 15
      }
    ],
    stockQuantity: 27,
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    seoTitle: "Designer Perfume - Exclusive Fragrance | KOLZO",
    seoDescription: "Exclusive designer perfume with unique fragrance notes. Long-lasting scent for sophisticated individuals.",
    seoKeywords: "designer perfume, exclusive fragrance, luxury perfume, sophisticated scent"
  }
];

// Sample user data
const sampleUsers = [
  {
    name: "Demo User",
    email: "demo@kolzo.com",
    password: "demo123",
    phone: "+91-9876543210",
    addresses: [
      {
        type: "home",
        name: "Demo User",
        phone: "+91-9876543210",
        address: "123 Luxury Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        isDefault: true
      }
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      currency: "INR",
      language: "en"
    }
  },
  {
    name: "Test Admin",
    email: "admin@kolzo.com",
    password: "admin123",
    phone: "+91-9876543211",
    addresses: [
      {
        type: "work",
        name: "Test Admin",
        phone: "+91-9876543211",
        address: "456 Business Avenue",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        isDefault: true
      }
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      currency: "INR",
      language: "en"
    }
  }
];

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kolzo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Seed products
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Seeded ${users.length} users`);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await seedProducts();
    await seedUsers();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Test Account Credentials:');
    console.log('Email: demo@kolzo.com');
    console.log('Password: demo123');
    console.log('\nEmail: admin@kolzo.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase(); 