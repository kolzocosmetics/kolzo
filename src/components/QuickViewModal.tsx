import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store/wishlistStore'
import { trackWishlistAdd, trackWishlistRemove } from '../utils/analytics'
import { formatPrice } from '../utils/priceFormatter'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setQuantity(1)
      setSelectedColor('Black')
      setSelectedSize('Medium')
    }
  }, [product])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!product) return null

  // Generate multiple images for the product
  const productImages = [
    product.image,
    product.image.replace('?', '?w=800&'),
    product.image.replace('?', '?w=600&'),
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-light tracking-[0.2em] uppercase">
                  Quick View
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Product Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-50 overflow-hidden group relative">
                    <motion.img 
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      loading="eager"
                      whileHover={{ scale: 1.02 }}
                    />
                    
                                         {/* Wishlist button */}
                     <motion.button 
                       onClick={() => {
                         if (product && isInWishlist(product.id)) {
                           removeFromWishlist(product.id)
                           trackWishlistRemove(product.id, product.name)
                           alert('Removed from wishlist!')
                         } else if (product) {
                           addToWishlist(product)
                           trackWishlistAdd(product.id, product.name)
                           alert('Added to wishlist!')
                         }
                       }}
                       className={`absolute top-4 right-4 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-lg ${
                         product && isInWishlist(product.id)
                           ? 'bg-red-50 hover:bg-red-100'
                           : 'bg-white/90 backdrop-blur-sm hover:bg-gray-100'
                       }`}
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <svg className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-700 fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                       </svg>
                     </motion.button>
                  </div>
                  
                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-3 gap-4">
                    {productImages.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index ? 'border-black' : 'border-transparent'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img 
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Product Details */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-light tracking-[0.1em] uppercase">
                      {product.name}
                    </h3>
                    <p className="text-3xl font-light">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-gray-500 font-light tracking-wide">
                      {product.category}
                    </p>
                    <p className="text-gray-600 font-light tracking-wide leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-light tracking-[0.2em] uppercase">
                      Color
                    </h4>
                    <div className="flex space-x-3">
                      {['Black', 'Brown', 'Beige'].map((color) => (
                        <motion.button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border-2 text-sm font-light tracking-wide transition-all duration-300 ${
                            selectedColor === color 
                              ? 'border-black bg-black text-white shadow-lg' 
                              : 'border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            backgroundColor: selectedColor === color ? '#000000' : '#FFFFFF',
                            color: selectedColor === color ? '#FFFFFF' : '#000000',
                            borderColor: selectedColor === color ? '#000000' : '#D1D5DB'
                          }}
                        >
                          {color}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-light tracking-[0.2em] uppercase">
                      Size
                    </h4>
                    <div className="flex space-x-3">
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <motion.button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border-2 text-sm font-light tracking-wide transition-all duration-300 ${
                            selectedSize === size 
                              ? 'border-black bg-black text-white shadow-lg' 
                              : 'border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            backgroundColor: selectedSize === size ? '#000000' : '#FFFFFF',
                            color: selectedSize === size ? '#FFFFFF' : '#000000',
                            borderColor: selectedSize === size ? '#000000' : '#D1D5DB'
                          }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-light tracking-[0.2em] uppercase">
                      Quantity
                    </h4>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center hover:border-black transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                        </svg>
                      </motion.button>
                      
                      <span className="text-lg font-light w-12 text-center">
                        {quantity}
                      </span>
                      
                      <motion.button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center hover:border-black transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 pt-6">
                    <motion.button
                      className="w-full bg-black text-white py-4 px-8 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add to Cart
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        if (product && isInWishlist(product.id)) {
                          removeFromWishlist(product.id)
                          trackWishlistRemove(product.id, product.name)
                          alert('Removed from wishlist!')
                        } else if (product) {
                          addToWishlist(product)
                          trackWishlistAdd(product.id, product.name)
                          alert('Added to wishlist!')
                        }
                      }}
                      className={`w-full border-2 py-4 px-8 font-light tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center shadow-lg ${
                        product && isInWishlist(product.id)
                          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-black hover:bg-black hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: product && isInWishlist(product.id) ? '#FEF2F2' : '#FFFFFF',
                        color: product && isInWishlist(product.id) ? '#DC2626' : '#000000',
                        borderColor: product && isInWishlist(product.id) ? '#EF4444' : '#000000'
                      }}
                    >
                      <svg className={`w-5 h-5 mr-3 ${product && isInWishlist(product.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {product && isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </motion.button>
                    
                    <Link
                      to={`/product/${product.id}`}
                      className="block text-center text-sm font-light tracking-[0.2em] uppercase hover:text-gray-600 transition-all duration-300"
                      onClick={onClose}
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickViewModal 