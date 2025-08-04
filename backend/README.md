# Kolzo Backend API

A production-ready Node.js/Express backend for the Kolzo luxury e-commerce platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Registration, login, password reset, email verification
- **Product Management**: CRUD operations with advanced filtering and search
- **Order Management**: Complete order lifecycle with payment integration
- **Payment Processing**: Stripe integration for secure payments
- **File Upload**: Image upload with Cloudinary integration
- **Caching**: Redis-based caching for improved performance
- **Security**: Rate limiting, input validation, XSS protection
- **Logging**: Comprehensive logging with Winston
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest-based testing suite

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Email**: Nodemailer
- **Validation**: Express-validator
- **Logging**: Winston
- **Testing**: Jest + Supertest

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 5+
- Redis 6+ (optional)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/kolzo

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@kolzo.in
```

### 3. Database Setup

Start MongoDB:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

When running in development mode, API documentation is available at:
`http://localhost:5000/api-docs`

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── redis.js      # Redis connection
│   │   └── swagger.js    # API documentation
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   ├── email.js
│   │   └── upload.js
│   └── server.js         # Main server file
├── uploads/              # File uploads
├── logs/                 # Application logs
├── tests/                # Test files
├── package.json
├── env.example
└── README.md
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `GET /api/auth/me` - Get current user

## 🛍️ Product Management

### Product Endpoints

- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Product Filtering

```
GET /api/products?category=Handbags&gender=women&minPrice=1000&maxPrice=50000&sort=price&order=asc&page=1&limit=20
```

## 🛒 Order Management

### Order Endpoints

- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin only)

## 💳 Payment Integration

### Payment Endpoints

- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund

## 📧 Email Templates

The backend includes email templates for:
- Email verification
- Password reset
- Order confirmation
- Shipping updates

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Production Deployment

### 1. Environment Variables

Set production environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kolzo
REDIS_URL=redis://your-redis-url
```

### 2. Build and Start

```bash
npm start
```

### 3. Process Management

Use PM2 for production process management:

```bash
npm install -g pm2
pm2 start src/server.js --name "kolzo-api"
pm2 save
pm2 startup
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes all inputs
- **XSS Protection**: Prevents cross-site scripting
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logging**: Winston with file and console output
- **Error Tracking**: Comprehensive error handling
- **Performance**: Request timing and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@kolzo.in or create an issue in the repository. 