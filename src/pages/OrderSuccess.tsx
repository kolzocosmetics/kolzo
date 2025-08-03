import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { formatPrice } from '../utils/priceFormatter'

const OrderSuccess = () => {
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative h-[50vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-green-50"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
              Order Confirmed
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Order Details */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-8 text-center">
              Order Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
                  Order Information
                </h3>
                <div className="space-y-3 text-sm font-light tracking-wide">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#KOLZO-2025-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">{formatPrice(276390)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
                  Shipping Information
                </h3>
                <div className="space-y-3 text-sm font-light tracking-wide">
                  <div>
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <p className="font-medium">3-5 Business Days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Shipping Address:</span>
                    <p className="font-medium">123 Luxury Lane<br />New York, NY 10001</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tracking Number:</span>
                    <p className="font-medium">Will be provided via email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            What's Next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
                Confirmation Email
              </h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                You'll receive a confirmation email with your order details and tracking information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
                Order Processing
              </h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                Your order is being prepared and will be shipped within 1-2 business days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
                Track Your Order
              </h3>
              <p className="text-sm text-gray-600 font-light tracking-wide">
                You can track your order status in your account or through the tracking link in your email.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/my-order"
              className="px-8 py-4 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
            >
              View Order
            </Link>
            
            <Link
              to="/"
              className="px-8 py-4 border-2 border-gray-300 text-gray-600 font-light tracking-[0.2em] uppercase hover:border-black hover:text-black transition-all duration-500"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderSuccess 