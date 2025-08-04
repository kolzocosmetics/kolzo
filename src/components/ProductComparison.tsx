
import { useState } from 'react'
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
  specifications?: {
    material?: string
    dimensions?: string
    weight?: string
    care?: string
    warranty?: string
  }
}

interface ProductComparisonProps {
  products: Product[]
  onRemoveProduct: (productId: string) => void
}

const ProductComparison = ({ products, onRemoveProduct }: ProductComparisonProps) => {
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [selectedVariants, setSelectedVariants] = useState<Record<string, { size: string; color: string }>>({})

  const handleAddToCart = (product: Product) => {
    const variant = selectedVariants[product.id] || { size: 'Medium', color: 'Black' }
    addToCart(product, 1, variant.size, variant.color)
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

  const handleVariantChange = (productId: string, field: 'size' | 'color', value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }))
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
          Product Comparison
        </h2>
        <p className="text-gray-600 font-light mb-6">
          Add products to compare their features and specifications
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-8 py-3 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const minPrice = Math.min(...products.map(p => p.price))
  const maxPrice = Math.max(...products.map(p => p.price))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-4">
          Product Comparison
        </h1>
        <p className="text-gray-600 font-light">
          Compare {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full border border-gray-200">
          {/* Product Headers */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="bg-gray-50 p-4 border-r border-gray-200">
              <h3 className="font-light tracking-[0.2em] uppercase text-sm">Product</h3>
            </div>
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 p-4 border-r border-gray-200 last:border-r-0">
                <div className="relative">
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  <div className="text-center">
                    <img
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'}
                      alt={product.name}
                      className="w-32 h-32 object-cover mx-auto mb-4"
                    />
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h4>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {renderStars(product.averageRating || 0)}
                      <span className="text-xs text-gray-600">({product.totalReviews || 0})</span>
                    </div>
                    <div className="text-lg font-medium mb-3">
                      {formatPrice(product.price)}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Basic Information */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="bg-gray-50 p-4 border-r border-gray-200 border-t border-gray-200">
              <h3 className="font-light tracking-[0.2em] uppercase text-sm">Basic Information</h3>
            </div>
            {products.map((product) => (
              <div key={product.id} className="p-4 border-r border-gray-200 border-t border-gray-200 last:border-r-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Brand:</span>
                    <p className="font-medium">{product.brand || 'Kolzo'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>
                    <p className="font-medium capitalize">{product.gender || 'Unisex'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Specifications */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="bg-gray-50 p-4 border-r border-gray-200 border-t border-gray-200">
              <h3 className="font-light tracking-[0.2em] uppercase text-sm">Specifications</h3>
            </div>
            {products.map((product) => (
              <div key={product.id} className="p-4 border-r border-gray-200 border-t border-gray-200 last:border-r-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <p className="font-medium">{product.specifications?.material || 'Premium materials'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <p className="font-medium">{product.specifications?.dimensions || 'Standard size'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <p className="font-medium">{product.specifications?.weight || 'Lightweight'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Care:</span>
                    <p className="font-medium">{product.specifications?.care || 'Professional care recommended'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Variants */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="bg-gray-50 p-4 border-r border-gray-200 border-t border-gray-200">
              <h3 className="font-light tracking-[0.2em] uppercase text-sm">Available Options</h3>
            </div>
            {products.map((product) => (
              <div key={product.id} className="p-4 border-r border-gray-200 border-t border-gray-200 last:border-r-0">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-light mb-1">Size:</label>
                    <select
                      value={selectedVariants[product.id]?.size || 'Medium'}
                      onChange={(e) => handleVariantChange(product.id, 'size', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300"
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-light mb-1">Color:</label>
                    <select
                      value={selectedVariants[product.id]?.color || 'Black'}
                      onChange={(e) => handleVariantChange(product.id, 'color', e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300"
                    >
                      <option value="Black">Black</option>
                      <option value="Brown">Brown</option>
                      <option value="Beige">Beige</option>
                      <option value="Red">Red</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="bg-gray-50 p-4 border-r border-gray-200 border-t border-gray-200">
              <h3 className="font-light tracking-[0.2em] uppercase text-sm">Actions</h3>
            </div>
            {products.map((product) => (
              <div key={product.id} className="p-4 border-r border-gray-200 border-t border-gray-200 last:border-r-0">
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-black text-white py-2 px-4 text-xs font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`w-full py-2 px-4 text-xs font-light tracking-[0.2em] uppercase border transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'border-red-300 text-red-600 hover:bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="block w-full text-center py-2 px-4 text-xs font-light tracking-[0.2em] uppercase border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50">
        <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">Comparison Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <p className="text-gray-600">
              {formatPrice(minPrice)} - {formatPrice(maxPrice)}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Average Rating</h4>
            <p className="text-gray-600">
              {(products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length).toFixed(1)} / 5
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <p className="text-gray-600">
              {Array.from(new Set(products.map(p => p.category))).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductComparison 