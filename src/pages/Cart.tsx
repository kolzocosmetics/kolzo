import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

const Cart = () => {
  // Placeholder cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'item-1',
      name: 'Kolzo Signature Shoulder Bag',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      quantity: 1,
      color: 'Black',
      size: 'Medium'
    },
    {
      id: 'item-2', 
      name: 'Kolzo Rouge Velvet Lipstick',
      price: 65,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80',
      quantity: 2,
      color: 'Crimson'
    }
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 200 ? 0 : 25
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-6">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-4 font-light tracking-wide">
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
                className="inline-block bg-black text-white px-8 py-4 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
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
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 py-8 border-b border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-light tracking-wide mb-3">{item.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1 font-light tracking-wide">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.size && <p>Size: {item.size}</p>}
                        <p className="font-medium">${item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-light">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-medium mb-3">${(item.price * item.quantity).toLocaleString()}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-gray-500 hover:text-red-500 transition-all duration-300 font-light tracking-wide"
                      >
                        Remove
                      </button>
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
              <div className="bg-gray-50 p-8">
                <h3 className="text-xl font-light tracking-[0.1em] uppercase mb-8">Order Summary</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-light tracking-wide">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-light tracking-wide">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600 font-light tracking-wide">Free shipping on orders over $200!</p>
                  )}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button
                    className="w-full bg-black text-white py-4 px-8 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Checkout
                  </motion.button>
                  
                  <Link
                    to="/"
                    className="block text-center text-gray-600 font-light tracking-wide hover:text-black transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart