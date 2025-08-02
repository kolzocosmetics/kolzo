import { motion } from 'framer-motion'
import { useEffect } from 'react'

const CareRepair = () => {
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
              Care & Repair
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Maintain the beauty and longevity of your Kolzo products
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Leather Care */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Leather Care
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                Daily Care
              </h3>
              <div className="space-y-4 text-gray-600 font-light tracking-wide leading-relaxed">
                <p>• Wipe with a soft, dry cloth to remove surface dust</p>
                <p>• Store in a cool, dry place away from direct sunlight</p>
                <p>• Avoid contact with water, oils, and harsh chemicals</p>
                <p>• Use a leather conditioner every 3-6 months</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                Deep Cleaning
              </h3>
              <div className="space-y-4 text-gray-600 font-light tracking-wide leading-relaxed">
                <p>• Use a specialized leather cleaner for stubborn stains</p>
                <p>• Test any product on a small, hidden area first</p>
                <p>• Apply conditioner after cleaning to restore moisture</p>
                <p>• Allow to air dry naturally, never use heat</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product-Specific Care */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Product-Specific Care
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Handbags
              </h3>
              <div className="space-y-3 text-gray-600 font-light tracking-wide">
                <p>• Stuff with tissue paper when not in use</p>
                <p>• Store in dust bags provided</p>
                <p>• Rotate bags to prevent overuse</p>
                <p>• Clean hardware with a soft cloth</p>
              </div>
            </div>
            
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Shoes
              </h3>
              <div className="space-y-3 text-gray-600 font-light tracking-wide">
                <p>• Use shoe trees to maintain shape</p>
                <p>• Clean soles regularly</p>
                <p>• Apply waterproofing spray</p>
                <p>• Rotate between pairs</p>
              </div>
            </div>
            
            <div className="p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Jewelry
              </h3>
              <div className="space-y-3 text-gray-600 font-light tracking-wide">
                <p>• Store in individual pouches</p>
                <p>• Clean with jewelry cloth</p>
                <p>• Avoid contact with perfumes</p>
                <p>• Remove before swimming</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Repair Services */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Repair Services
          </h2>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                  Available Services
                </h3>
                <div className="space-y-4 text-gray-600 font-light tracking-wide">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Stitch repair and reinforcement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hardware replacement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Leather conditioning and restoration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Color touch-up and refinishing</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                  How to Request Repair
                </h3>
                <div className="space-y-4 text-gray-600 font-light tracking-wide">
                  <p>1. Contact us via Instagram with photos of the damage</p>
                  <p>2. Include your order number and product details</p>
                  <p>3. We'll assess the repair and provide a quote</p>
                  <p>4. Once approved, we'll guide you through the process</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-6">
            Need Help?
          </h2>
          <p className="text-gray-600 font-light tracking-wide mb-8">
            Have questions about care or need repair services? Contact us via Instagram
          </p>
          <a
            href="https://www.instagram.com/kolzocosmetics"
            target="_blank"
            rel="noopener noreferrer"
                            className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default CareRepair 