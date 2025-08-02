import { motion } from 'framer-motion'
import { useEffect } from 'react'

const MyOrder = () => {
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative h-[40vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gray-100"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
              My Order
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Track your orders and manage your purchases
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
              Order Management
            </h2>
            <p className="text-gray-600 font-light tracking-wide mb-8">
              This feature is coming soon. For order inquiries, please contact us via Instagram.
            </p>
            <a
              href="https://www.instagram.com/kolzocosmetics"
              target="_blank"
              rel="noopener noreferrer"
                              className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MyOrder 