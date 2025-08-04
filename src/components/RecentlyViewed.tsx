import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { formatPrice } from '../utils/priceFormatter'
import { trackWishlistAdd, trackWishlistRemove } from '../utils/analytics'

interface Product {
  _id?: string
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  gender?: 'men' | 'women' | 'unisex'
  image?: string
  images?: string[]
  variants?: any[]
  tags?: string[]
  status?: 'active' | 'inactive' | 'draft'
  averageRating?: number
  totalReviews?: number
  salesCount?: number
  featured?: boolean
  createdAt?: string
  updatedAt?: string
  size?: string
  viewedAt: number
}

interface RecentlyViewedProps {
  maxItems?: number
  title?: string
}

const RecentlyViewed = ({ maxItems = 4, title = 'Recently Viewed' }: RecentlyViewedProps) => {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    loadRecentProducts()
  }, [])

  const loadRecentProducts = () => {
    try {
      const stored = localStorage.getItem('kolzo-recently-viewed')
      if (stored) {
        const products: Product[] = JSON.parse(stored)
        // Sort by viewedAt (most recent first) and limit to maxItems
        const sortedProducts = products
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, maxItems)
        setRecentProducts(sortedProducts)
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error)
    }
  }



  const handleAddToCart = (product: Product) => {
    addItem(product, 1, 'Medium', 'Black')
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      trackWishlistRemove(product.id, product.name)
    } else {
      addToWishlist(product)
      trackWishlistAdd(product.id, product.name)
    }
  }

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-2">
          {title}
        </h2>
        <p className="text-gray-600 font-light">
          Products you've recently viewed
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="relative overflow-hidden bg-gray-100">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              {/* Viewed Time Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {formatTimeAgo(product.viewedAt)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(product.averageRating || 0)}
                <span className="text-sm text-gray-600">
                  ({product.totalReviews || 0})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-black text-white py-2 px-4 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed 