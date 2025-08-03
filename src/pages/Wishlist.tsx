import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store/wishlistStore'
import { luxuryAnimations } from '../utils/luxuryAnimations'
import { trackWishlistRemove } from '../utils/analytics'

const Wishlist = () => {
  const { items, removeItem, clearWishlist, getItemCount } = useWishlistStore()

  const handleRemoveItem = (id: string, name: string) => {
    trackWishlistRemove(id, name)
    removeItem(id)
  }

  const handleClearWishlist = () => {
    clearWishlist()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-8">
              Your Wishlist
            </h1>
            
            <p className="text-gray-600 font-light tracking-wide text-lg mb-12 max-w-md mx-auto">
              Your wishlist is empty. Start exploring our collection to add items you love.
            </p>
            
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/"
                className="inline-block bg-black text-white py-4 px-12 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
                whileHover={luxuryAnimations.button.hover}
                whileTap={luxuryAnimations.button.tap}
              >
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-8">
            Your Wishlist
          </h1>
          <p className="text-gray-600 font-light tracking-wide text-lg">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </motion.div>

        {/* Wishlist Items */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              whileHover={luxuryAnimations.productCard.hover}
              whileTap={luxuryAnimations.productCard.tap}
            >
              <Link to={`/product/${item.id}`}>
                <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative">
                  <motion.img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    whileHover={luxuryAnimations.image.hover}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500" />
                  
                  {/* Remove from wishlist button */}
                  <motion.button 
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-red-50 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemoveItem(item.id, item.name)
                    }}
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="text-center">
                  <h3 className="text-sm font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors duration-500">
                    {item.name}
                  </h3>
                  <p className="text-lg font-light tracking-[0.1em]">${item.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex justify-center">
            <motion.button
              onClick={handleClearWishlist}
              className="px-8 py-4 border-2 border-gray-300 text-gray-600 font-light tracking-[0.2em] uppercase hover:border-red-500 hover:text-red-500 transition-all duration-500 shadow-lg"
              whileHover={luxuryAnimations.button.hover}
              whileTap={luxuryAnimations.button.tap}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#374151',
                borderColor: '#D1D5DB',
                display: 'inline-block',
                visibility: 'visible',
                opacity: 1
              }}
            >
              Clear Wishlist
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Wishlist