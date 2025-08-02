import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

const Wishlist = () => {
  // Enhanced wishlist items with better images
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 'perfume-001',
      name: 'Kolzo Essence Eau de Parfum',
      price: 420,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2004&q=80',
      category: 'Perfumes'
    },
    {
      id: 'handbag-002',
      name: 'Kolzo Evening Clutch',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      category: 'Handbags'
    },
    {
      id: 'blush-001',
      name: 'Kolzo Natural Glow Blush',
      price: 75,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80',
      category: 'Blush'
    },
    {
      id: 'shoes-001',
      name: 'Kolzo Summer Slides',
      price: 850,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      category: 'Shoes'
    },
    {
      id: 'lipstick-001',
      name: 'Kolzo Rouge Velvet Lipstick',
      price: 65,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80',
      category: 'Lipstick'
    },
    {
      id: 'wallet-001',
      name: 'Kolzo Men\'s Leather Wallet',
      price: 650,
      image: 'https://images.unsplash.com/photo-1627123425017-8f2af085be90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      category: 'Wallets'
    }
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative h-[40vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury wishlist"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase mb-6">
              Your Wishlist
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Curated items you love, saved for later
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Wishlist Status */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <p className="text-gray-600 font-light tracking-wide">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-light tracking-[0.1em] mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 font-light tracking-wide">Browse our collections and save items you love</p>
              <Link
                to="/"
                className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
              >
                Explore Collections
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <div className="relative">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`}>
                    <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative cursor-pointer rounded-lg">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500" />
                    </div>
                  </Link>
                  
                  {/* Remove from wishlist button */}
                  <motion.button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all duration-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
                
                {/* Product Info */}
                <div className="text-center">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 font-light tracking-wide">{item.category}</p>
                    <p className="text-lg font-medium mb-6">${item.price.toLocaleString()}</p>
                  </Link>
                  
                  {/* Add to Cart Button */}
                  <motion.button
                    className="w-full bg-transparent text-black border border-gray-400 py-3 px-6 text-sm font-light tracking-[0.1em] uppercase hover:bg-gray-100 transition-all duration-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Continue Shopping */}
        {wishlistItems.length > 0 && (
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Link
              to="/"
              className="inline-block text-gray-600 font-light tracking-wide hover:text-black transition-all duration-300 border-b border-gray-300 hover:border-black pb-1"
            >
              Continue Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Wishlist