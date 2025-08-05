import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { addToNewsletter, removeFromNewsletter, getNewsletterStats, sendWelcomeEmail } from './brevo'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  type: 'shipping' | 'billing';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  language: string;
  currency: string;
}

export interface Product {
  _id?: string;
  id: string; // Make id required for compatibility with data files
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex';
  image?: string; // For compatibility with data files
  images?: string[];
  variants?: ProductVariant[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  averageRating?: number;
  totalReviews?: number;
  salesCount?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  size?: string; // Add size for compatibility
}

export interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  price?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
}

export interface Review {
  _id: string;
  user: User;
  product: Product;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchSuggestion {
  suggestions: string[];
  query: string;
}

export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: 'website' | 'checkout' | 'popup' | 'footer';
  consent: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    this.loadToken();
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private loadToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
    }
  }

  // Generic request method
  private async request<T>(config: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client(config);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
  }

  async signup(name: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request({
      method: 'POST',
      url: '/auth/signup',
      data: { name, email, password },
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: '/auth/logout',
    });
  }

  async checkAuth(): Promise<ApiResponse<{ user: User }>> {
    return this.request({
      method: 'GET',
      url: '/auth/me',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request({
      method: 'POST',
      url: '/auth/refresh',
    });
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request({
      method: 'GET',
      url: '/products',
      params,
    });
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request({
      method: 'GET',
      url: `/products/${id}`,
    });
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request({
      method: 'GET',
      url: '/products/featured',
    });
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request({
      method: 'GET',
      url: '/products/categories',
    });
  }

  async getBrands(): Promise<ApiResponse<string[]>> {
    return this.request({
      method: 'GET',
      url: '/products/brands',
    });
  }

  // Search endpoints
  async searchProducts(params: {
    q?: string;
    category?: string;
    brand?: string;
    gender?: string;
    price_min?: number;
    price_max?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResult>> {
    return this.request({
      method: 'GET',
      url: '/search/products',
      params,
    });
  }

  async getSearchSuggestions(query: string, limit?: number): Promise<ApiResponse<SearchSuggestion>> {
    return this.request({
      method: 'GET',
      url: '/search/suggestions',
      params: { q: query, limit },
    });
  }

  async getPopularSearches(): Promise<ApiResponse<{ searches: { term: string; count: number }[] }>> {
    return this.request({
      method: 'GET',
      url: '/search/popular',
    });
  }

  async getSearchHistory(): Promise<ApiResponse<{ history: any[] }>> {
    return this.request({
      method: 'GET',
      url: '/search/history',
    });
  }

  async clearSearchHistory(): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: '/search/history',
    });
  }

  // Wishlist endpoints
  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    return this.request({
      method: 'GET',
      url: '/wishlist',
    });
  }

  async addToWishlist(productId: string): Promise<ApiResponse<WishlistItem>> {
    return this.request({
      method: 'POST',
      url: '/wishlist',
      data: { productId },
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/wishlist/${productId}`,
    });
  }

  async clearWishlist(): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: '/wishlist',
    });
  }

  async moveWishlistToCart(productId: string): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: `/wishlist/${productId}/move-to-cart`,
    });
  }

  async shareWishlist(email: string, message?: string): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: '/wishlist/share',
      data: { email, message },
    });
  }

  // Order endpoints
  async getOrders(params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return this.request({
      method: 'GET',
      url: '/orders',
      params,
    });
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request({
      method: 'GET',
      url: `/orders/${id}`,
    });
  }

  async createOrder(orderData: {
    items: { productId: string; variantId: string; quantity: number }[];
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> {
    return this.request({
      method: 'POST',
      url: '/orders',
      data: orderData,
    });
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return this.request({
      method: 'PATCH',
      url: `/orders/${id}/cancel`,
      data: { reason },
    });
  }

  // Payment endpoints
  async createPaymentIntent(amount: number, currency: string = 'inr'): Promise<ApiResponse<PaymentIntent>> {
    return this.request({
      method: 'POST',
      url: '/payments/create-intent',
      data: { amount, currency },
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: '/payments/confirm',
      data: { paymentIntentId },
    });
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return this.request({
      method: 'GET',
      url: '/payments/methods',
    });
  }

  async attachPaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: '/payments/attach-method',
      data: { paymentMethodId },
    });
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/payments/methods/${paymentMethodId}`,
    });
  }

  // User profile endpoints
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request({
      method: 'GET',
      url: '/users/profile',
    });
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request({
      method: 'PUT',
      url: '/users/profile',
      data,
    });
  }

  async addAddress(address: Omit<Address, '_id'>): Promise<ApiResponse<Address>> {
    return this.request({
      method: 'POST',
      url: '/users/addresses',
      data: address,
    });
  }

  async updateAddress(id: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.request({
      method: 'PUT',
      url: `/users/addresses/${id}`,
      data: address,
    });
  }

  async deleteAddress(id: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/users/addresses/${id}`,
    });
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return this.request({
      method: 'PUT',
      url: '/users/preferences',
      data: preferences,
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request({
      method: 'PUT',
      url: '/users/change-password',
      data: { currentPassword, newPassword },
    });
  }

  // Review endpoints
  async getProductReviews(productId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
    rating?: number;
  }): Promise<ApiResponse<PaginatedResponse<Review> & { stats: any }>> {
    return this.request({
      method: 'GET',
      url: `/reviews/product/${productId}`,
      params,
    });
  }

  async createReview(data: {
    productId: string;
    rating: number;
    title: string;
    content: string;
    images?: string[];
  }): Promise<ApiResponse<Review>> {
    return this.request({
      method: 'POST',
      url: '/reviews',
      data,
    });
  }

  async updateReview(id: string, data: Partial<Review>): Promise<ApiResponse<Review>> {
    return this.request({
      method: 'PUT',
      url: `/reviews/${id}`,
      data,
    });
  }

  async deleteReview(id: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/reviews/${id}`,
    });
  }

  async markReviewHelpful(id: string): Promise<ApiResponse<{ helpfulCount: number }>> {
    return this.request({
      method: 'POST',
      url: `/reviews/${id}/helpful`,
    });
  }

  async getUserReviews(params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Review>>> {
    return this.request({
      method: 'GET',
      url: '/reviews/user/me',
      params,
    });
  }

  // Newsletter endpoints
  async subscribeToNewsletter(data: NewsletterSubscription): Promise<ApiResponse<{ email: string; subscriberId: string }>> {
    return this.request({
      method: 'POST',
      url: '/newsletter/subscribe',
      data,
    });
  }

  async unsubscribeFromNewsletter(email: string): Promise<ApiResponse> {
    return this.request({
      method: 'POST',
      url: '/newsletter/unsubscribe',
      data: { email },
    });
  }

  async getNewsletterStats(): Promise<ApiResponse<{
    totalSubscribers: number;
    openRate: number;
    clickRate: number;
  }>> {
    return this.request({
      method: 'GET',
      url: '/newsletter/stats',
    });
  }

  // Brevo Integration Methods
  async addToBrevoNewsletter(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    source?: string;
    consent?: boolean;
  }): Promise<ApiResponse<{ email: string; subscriberId: string }>> {
    try {
      const response = await addToNewsletter(data);
      
      return {
        success: response.success,
        message: response.message,
        data: response.success ? { email: data.email, subscriberId: Date.now().toString() } : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to subscribe to newsletter'
      };
    }
  }

  async removeFromBrevoNewsletter(email: string): Promise<ApiResponse> {
    try {
      const response = await removeFromNewsletter(email);
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to unsubscribe from newsletter'
      };
    }
  }

  async getBrevoNewsletterStats(): Promise<ApiResponse<{
    totalSubscribers: number;
    openRate: number;
    clickRate: number;
  }>> {
    try {
      const response = await getNewsletterStats();
      
      if (response.success && response.data) {
        // Extract stats from Brevo response
        const lists = response.data.lists || [];
        const totalSubscribers = lists.reduce((sum: number, list: any) => sum + (list.uniqueSubscribers || 0), 0);
        
        return {
          success: true,
          data: {
            totalSubscribers,
            openRate: 0, // Would need to calculate from email campaigns
            clickRate: 0  // Would need to calculate from email campaigns
          }
        };
      }
      
      return {
        success: false,
        message: 'Failed to get newsletter statistics'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get newsletter statistics'
      };
    }
  }

  async sendBrevoWelcomeEmail(email: string, firstName?: string): Promise<ApiResponse> {
    try {
      const response = await sendWelcomeEmail(email, firstName);
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send welcome email'
      };
    }
  }

  // Admin endpoints (only for admin users)
  async getDashboardStats(): Promise<ApiResponse<{
    metrics: {
      totalProducts: number;
      totalOrders: number;
      totalUsers: number;
      totalRevenue: number;
      pendingReviews: number;
      lowStockProducts: number;
    };
    recentOrders: Order[];
    salesData: any[];
    topProducts: Product[];
  }>> {
    return this.request({
      method: 'GET',
      url: '/admin/dashboard',
    });
  }

  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request({
      method: 'GET',
      url: '/admin/products',
      params,
    });
  }

  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request({
      method: 'POST',
      url: '/admin/products',
      data,
    });
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request({
      method: 'PUT',
      url: `/admin/products/${id}`,
      data,
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request({
      method: 'DELETE',
      url: `/admin/products/${id}`,
    });
  }

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return this.request({
      method: 'GET',
      url: '/admin/orders',
      params,
    });
  }

  async updateOrderStatus(id: string, data: {
    status: string;
    trackingNumber?: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> {
    return this.request({
      method: 'PATCH',
      url: `/admin/orders/${id}/status`,
      data,
    });
  }

  async getAdminUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.request({
      method: 'GET',
      url: '/admin/users',
      params,
    });
  }

  async updateUserStatus(id: string, data: { status: string; reason?: string }): Promise<ApiResponse<User>> {
    return this.request({
      method: 'PATCH',
      url: `/admin/users/${id}/status`,
      data,
    });
  }

  async getAdminReviews(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<Review>>> {
    return this.request({
      method: 'GET',
      url: '/admin/reviews',
      params,
    });
  }
}

// Create and export a singleton instance
const api = new ApiClient();
export default api; 