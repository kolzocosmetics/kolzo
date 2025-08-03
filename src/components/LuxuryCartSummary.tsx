import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { luxuryAnimations } from '../utils/luxuryAnimations'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface LuxuryCartSummaryProps {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

const LuxuryCartSummary = ({ cartItems, onUpdateQuantity, onRemoveItem }: LuxuryCartSummaryProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 200 ? 0 : 25
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-8 text-center">
        Order Summary
      </h3>
      
      <div className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-light tracking-wide truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 font-light tracking-wide">
                  {item.color && `${item.color}`}
                  {item.size && item.color && ' • '}
                  {item.size && `${item.size}`}
                </p>
                <p className="text-sm font-medium">
                  ${item.price.toLocaleString()}
                </p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                  </svg>
                </motion.button>
                
                <span className="text-sm font-light w-8 text-center">
                  {item.quantity}
                </span>
                
                <motion.button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Remove Button */}
              <motion.button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        {/* Summary Details */}
        <div className="space-y-3 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-light tracking-wide">Subtotal</span>
            <span className="text-sm font-medium">${subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-light tracking-wide">Shipping</span>
            <span className="text-sm font-medium">
              {shipping === 0 ? 'Free' : `$${shipping}`}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-light tracking-wide">Tax</span>
            <span className="text-sm font-medium">${tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-light tracking-wide">Total</span>
            <span className="text-lg font-medium">${total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout Button */}
        <motion.button
          onClick={() => {
            console.log('Checkout button clicked!')
            window.location.href = '/checkout'
          }}
          className="w-full bg-black text-white py-4 px-8 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500 mt-8 relative z-20 !important"
          whileHover={luxuryAnimations.button.hover}
          whileTap={luxuryAnimations.button.tap}
          style={{ 
            position: 'relative',
            zIndex: 20,
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000'
          }}
        >
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Proceed to Checkout</span>
          </div>
        </motion.button>
        
        {/* Continue Shopping */}
        <Link
          to="/"
          className="block text-center text-sm font-light tracking-[0.2em] uppercase hover:text-gray-600 transition-all duration-300 mt-4"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default LuxuryCartSummary 