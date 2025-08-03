import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import LuxuryCartSummary from '../components/LuxuryCartSummary'
import { useCartStore } from '../store/cartStore'
import { trackRemoveFromCart } from '../utils/analytics'



const Cart = () => {
  const { items: cartItems, updateQuantity, removeItem } = useCartStore()

  const handleRemoveItem = (id: string) => {
    const item = cartItems.find(item => item.id === id)
    if (item) {
      trackRemoveFromCart(item.id, item.name, item.price, item.quantity)
    }
    removeItem(id)
  }



  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            alt="Luxury shopping"
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
              Shopping Cart
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Review your selections and proceed to checkout
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Cart Status */}
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
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 4.5m2.5-4.5H19M9 19a2 2 0 102 2m10-2a2 2 0 102 2" />
              </svg>
              <h2 className="text-2xl font-light tracking-[0.1em] mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 font-light tracking-wide">Discover our collections and add items to your cart</p>
              <Link
                to="/"
                className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 py-8 border-b border-gray-200 hover:bg-gray-50 transition-all duration-500 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gray-50 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors duration-500">{item.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1 font-light tracking-wide">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                        <p className="font-medium text-lg">${item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        -
                      </motion.button>
                      <span className="w-16 text-center font-light">{item.quantity}</span>
                      <motion.button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        +
                      </motion.button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-medium mb-3">${(item.price * item.quantity).toLocaleString()}</p>
                      <motion.button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-gray-500 hover:text-red-500 transition-all duration-300 font-light tracking-wide"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <LuxuryCartSummary
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart