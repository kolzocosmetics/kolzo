import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { formatPrice } from '../utils/priceFormatter'

// Temporary Product interface to avoid import issues
interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex';
  image?: string;
  images?: string[];
  variants?: any[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  averageRating?: number;
  totalReviews?: number;
  salesCount?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
  showWishlist?: boolean
  className?: string
}

const ProductCard = ({ product, showQuickAdd = true, showWishlist = true, className = '' }: ProductCardProps) => {
  const { addItem: addToCart, getItemCount } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Adding to cart:', product.name, product.id)
    addToCart(product, 1)
    console.log('Cart updated, new count:', getItemCount())
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlistState = isInWishlist(product.id)

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img
            src={product.image || product.images?.[0] || ''}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'
            }}
          />
          
          {/* Product Badges */}
          {product.featured && (
            <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-xs font-light tracking-wide">
              Featured
            </div>
          )}
          
          {product.averageRating && (
            <div className="absolute top-4 right-4 bg-white/90 text-black px-2 py-1 text-xs font-light">
              ⭐ {product.averageRating.toFixed(1)}
            </div>
          )}

          {/* Quick Add to Cart Button */}
          {showQuickAdd && (
            <motion.button
              onClick={handleAddToCart}
              className="absolute top-4 left-4 p-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-800 shadow-lg z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </motion.button>
          )}

          {/* Wishlist Button */}
          {showWishlist && (
            <motion.button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg z-50 ${
                isInWishlistState 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                className={`w-5 h-5 ${isInWishlistState ? 'text-white' : 'text-gray-600'}`} 
                fill={isInWishlistState ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-lg font-light tracking-[0.1em] mb-2 group-hover:text-gray-600 transition-colors duration-500">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
            {product.brand || 'Kolzo'}
          </p>
          <p className="text-lg font-light tracking-[0.1em] group-hover:text-gray-800 transition-colors duration-500">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard 