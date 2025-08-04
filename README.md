# KOLZO - Luxury Fashion E-commerce Platform

A comprehensive full-stack e-commerce platform built with modern technologies, featuring a luxury fashion store with advanced functionality.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Luxury design with Framer Motion animations
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Performance Optimized**: Code splitting, lazy loading, image optimization
- **SEO Optimized**: Meta tags, structured data, sitemap generation
- **State Management**: Zustand for global state management
- **Type Safety**: Full TypeScript implementation

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive API with proper validation
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for session and data caching
- **Security**: Rate limiting, CORS, XSS protection, input validation
- **File Upload**: Image upload with optimization
- **Email System**: Transactional emails with templates
- **Payment Processing**: Stripe, PayPal, Razorpay integration
- **Search**: Advanced search with suggestions and analytics
- **Reviews**: Product review system with moderation
- **Admin Dashboard**: Complete admin interface
- **Newsletter**: Email Octopus integration

### E-commerce Features
- **Product Management**: Categories, brands, variants, inventory
- **Shopping Cart**: Persistent cart with local storage
- **Wishlist**: User wishlists with sharing
- **Order Management**: Complete order lifecycle
- **Payment Processing**: Multiple payment gateways
- **User Profiles**: Addresses, preferences, order history
- **Search & Filter**: Advanced product search
- **Reviews & Ratings**: Product reviews with moderation
- **Newsletter**: Email marketing integration
- **Analytics**: User behavior tracking

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - UI framework
- **TypeScript** - Type safety
- **Vite 7.0.4** - Build tool
- **TailwindCSS 4.1.11** - Styling
- **Framer Motion 12.23.12** - Animations
- **Zustand 5.0.7** - State management
- **React Router DOM 7.7.1** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Winston** - Logging

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Cloudflare** - CDN and DNS
- **Supabase** - Database (alternative)
- **Email Octopus** - Email marketing
- **Tawk.to** - Customer support

### Development Tools
- **Cursor** - Code editor
- **GitHub** - Version control
- **Warp.dev** - Terminal
- **ChatGPT** - AI assistance

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- Redis (local or cloud)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/kolzo-site-development.git
cd kolzo-site-development
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Frontend environment
cp .env.example .env

# Backend environment
cd backend
cp env.example .env
cd ..
```

4. **Configure Environment Variables**

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
```

Backend (.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kolzo
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

5. **Start Development Servers**
```bash
# Frontend (Terminal 1)
npm run dev

# Backend (Terminal 2)
cd backend
npm run dev
```

6. **Seed Database**
```bash
cd backend
npm run seed
```

## 🚀 Deployment

### Automated Deployment
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

#### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

#### Backend (Railway)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

### Domain Setup
- **Frontend**: kolzo.in
- **Backend**: api.kolzo.in
- **Email**: Zoho integration

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories
- `GET /api/products/brands` - Get brands

### Search
- `GET /api/search/products` - Search products
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/popular` - Get popular searches

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/methods` - Get payment methods

### Reviews
- `GET /api/reviews/product/:id` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/reviews` - Moderate reviews

## 🔧 Development

### Project Structure
```
kolzo-site-development/
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── backend/              # Backend source
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utility functions
│   └── scripts/          # Database scripts
├── public/               # Static files
└── docs/                # Documentation
```

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

#### Backend
```bash
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database
npm run test         # Run tests
npm run lint         # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Input Validation** with express-validator
- **XSS Protection** with helmet
- **SQL Injection Protection** with mongo-sanitize
- **CSRF Protection** with proper headers
- **Password Hashing** with bcrypt
- **Secure Headers** with helmet middleware

## 📊 Performance Features

- **Image Optimization** with Sharp
- **Code Splitting** for better loading
- **Lazy Loading** for components
- **Redis Caching** for API responses
- **CDN Integration** for static assets
- **Database Indexing** for faster queries
- **Compression** with gzip
- **Minification** of assets

## 🧪 Testing

### Frontend Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Run with coverage
```

### Backend Testing
```bash
cd backend
npm run test         # Run unit tests
npm run test:integration # Run integration tests
```

## 📈 Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: Google Analytics
- **Search Analytics**: Search Console
- **Uptime Monitoring**: Status page
- **Log Aggregation**: Winston logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.kolzo.in](https://docs.kolzo.in)
- **API Docs**: [api.kolzo.in/docs](https://api.kolzo.in/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/kolzo-site-development/issues)
- **Email**: support@kolzo.in

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic e-commerce functionality
- ✅ User authentication
- ✅ Product management
- ✅ Order processing
- ✅ Payment integration
- ✅ Search functionality
- ✅ Review system
- ✅ Newsletter integration

### Phase 2 (Next)
- 🔄 Advanced analytics
- 🔄 AI-powered recommendations
- 🔄 Multi-language support
- 🔄 Mobile app
- 🔄 Advanced inventory management
- 🔄 B2B features

### Phase 3 (Future)
- 📋 AR/VR product visualization
- 📋 Blockchain integration
- 📋 Advanced AI features
- 📋 Marketplace functionality
- 📋 International expansion

---

**Built with ❤️ by the KOLZO Team**
