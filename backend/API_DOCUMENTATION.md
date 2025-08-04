# KOLZO Backend API Documentation

## Overview

The KOLZO Backend API is a comprehensive e-commerce platform built with Node.js, Express, and MongoDB. It provides all necessary endpoints for a luxury fashion e-commerce application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <current-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token"
  }
}
```

#### POST /auth/logout
Logout user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### GET /auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true
    }
  }
}
```

### Products

#### GET /products
Get all products with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category
- `gender` (optional): Filter by gender (men, women, unisex)
- `brand` (optional): Filter by brand
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `sort` (optional): Sort by (price_asc, price_desc, name_asc, name_desc, newest, popular)
- `inStock` (optional): Filter by stock availability (true/false)
- `onSale` (optional): Filter by sale items (true/false)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Luxury Leather Handbag",
        "slug": "luxury-leather-handbag",
        "price": 25000,
        "originalPrice": 30000,
        "discountPercentage": 16.67,
        "category": "handbags",
        "gender": "women",
        "brand": "KOLZO",
        "primaryImage": "image_url",
        "isActive": true,
        "isFeatured": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /products/featured
Get featured products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Luxury Leather Handbag",
      "price": 25000,
      "primaryImage": "image_url"
    }
  ]
}
```

#### GET /products/:identifier
Get product by ID or slug.

**Parameters:**
- `identifier`: Product ID or slug

**Query Parameters:**
- `includeRelated` (optional): Include related products (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "product_id",
      "name": "Luxury Leather Handbag",
      "description": "Product description",
      "price": 25000,
      "variants": [
        {
          "name": "Black",
          "color": "Black",
          "size": "Standard",
          "price": 25000,
          "stockQuantity": 15
        }
      ],
      "images": ["image_url1", "image_url2"],
      "relatedProducts": []
    }
  }
}
```

#### GET /products/categories/list
Get all product categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "handbags",
      "count": 25
    }
  ]
}
```

#### GET /products/brands/list
Get all product brands.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "KOLZO",
      "count": 50
    }
  ]
}
```

#### GET /products/search/suggestions
Get search suggestions.

**Query Parameters:**
- `q`: Search query
- `limit` (optional): Number of suggestions (default: 5, max: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Luxury Leather Handbag",
      "brand": "KOLZO",
      "category": "handbags"
    }
  ]
}
```

### Orders

#### POST /orders
Create a new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "variantId": "variant_id"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "stripe",
  "notes": "Please deliver in the morning"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_id",
    "orderNumber": "KOLZO123456",
    "total": 50000,
    "paymentMethod": "stripe",
    "status": "pending"
  }
}
```

#### GET /orders/my-orders
Get user's orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "order_id",
        "orderNumber": "KOLZO123456",
        "status": "pending",
        "total": 50000,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

#### GET /orders/:orderId
Get order by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "order_id",
      "orderNumber": "KOLZO123456",
      "items": [],
      "status": "pending",
      "total": 50000
    }
  }
}
```

#### PATCH /orders/:orderId/cancel
Cancel an order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

#### GET /orders/:orderId/track
Track order status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "KOLZO123456",
    "status": "shipped",
    "timeline": [],
    "estimatedDelivery": "2024-01-05T00:00:00.000Z",
    "trackingNumber": "KOLZO123456"
  }
}
```

### Payments

#### POST /payments/create-payment-intent
Create Stripe payment intent.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_id",
  "currency": "inr"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_secret",
    "paymentIntentId": "pi_id",
    "amount": 5000000,
    "currency": "inr"
  }
}
```

#### POST /payments/confirm
Confirm payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_id",
  "orderId": "order_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

#### GET /payments/status/:orderId
Get payment status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_id",
    "paymentStatus": "paid",
    "total": 50000
  }
}
```

### Users

#### GET /users/profile
Get user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "preferences": {}
    }
  }
}
```

#### PATCH /users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543211"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### PATCH /users/change-password
Change password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### POST /users/addresses
Add address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "shipping",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully"
}
```

#### GET /users/addresses
Get user addresses.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "address_id",
      "type": "shipping",
      "street": "123 Main St",
      "city": "Mumbai",
      "isDefault": true
    }
  ]
}
```

### Wishlist

#### GET /wishlist
Get user's wishlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "item_id",
        "product": {
          "id": "product_id",
          "name": "Luxury Leather Handbag",
          "price": 25000
        },
        "addedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "itemCount": 1,
    "totalValue": 25000
  }
}
```

#### POST /wishlist/add
Add item to wishlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "variantId": "variant_id",
  "notes": "Birthday gift"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist successfully"
}
```

#### DELETE /wishlist/remove/:itemId
Remove item from wishlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist successfully"
}
```

#### GET /wishlist/check/:productId
Check if product is in wishlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `variantId` (optional): Variant ID

**Response:**
```json
{
  "success": true,
  "data": {
    "isInWishlist": true
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Slowing down after 50 requests per 15 minutes

## Environment Variables

Required environment variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kolzo

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Testing

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

Test accounts:
- User: john@example.com / password123
- User: jane@example.com / password123
- Admin: admin@kolzo.in / admin123

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api` 