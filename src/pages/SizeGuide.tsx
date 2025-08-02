import { motion } from 'framer-motion'
import { useEffect } from 'react'

const SizeGuide = () => {
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
              Size Guide
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Find your perfect fit for Kolzo products
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Handbags Size Guide */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Handbags
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Small
              </h3>
              <div className="space-y-2 text-gray-600 font-light tracking-wide">
                <p>Dimensions: 8" x 6" x 2"</p>
                <p>Perfect for essentials</p>
                <p>Phone, keys, wallet</p>
              </div>
            </div>
            
            <div className="text-center p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Medium
              </h3>
              <div className="space-y-2 text-gray-600 font-light tracking-wide">
                <p>Dimensions: 12" x 9" x 3"</p>
                <p>Ideal for daily use</p>
                <p>Laptop, documents, makeup</p>
              </div>
            </div>
            
            <div className="text-center p-6 border border-gray-200">
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Large
              </h3>
              <div className="space-y-2 text-gray-600 font-light tracking-wide">
                <p>Dimensions: 16" x 12" x 4"</p>
                <p>Perfect for travel</p>
                <p>Work essentials, weekend trips</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shoes Size Guide */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Shoes
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-light tracking-[0.2em] uppercase">US Size</th>
                  <th className="text-left py-4 px-6 font-light tracking-[0.2em] uppercase">EU Size</th>
                  <th className="text-left py-4 px-6 font-light tracking-[0.2em] uppercase">UK Size</th>
                  <th className="text-left py-4 px-6 font-light tracking-[0.2em] uppercase">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">5</td>
                  <td className="py-4 px-6 font-light tracking-wide">35</td>
                  <td className="py-4 px-6 font-light tracking-wide">3</td>
                  <td className="py-4 px-6 font-light tracking-wide">22.5</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">6</td>
                  <td className="py-4 px-6 font-light tracking-wide">36</td>
                  <td className="py-4 px-6 font-light tracking-wide">4</td>
                  <td className="py-4 px-6 font-light tracking-wide">23.5</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">7</td>
                  <td className="py-4 px-6 font-light tracking-wide">37</td>
                  <td className="py-4 px-6 font-light tracking-wide">5</td>
                  <td className="py-4 px-6 font-light tracking-wide">24.5</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">8</td>
                  <td className="py-4 px-6 font-light tracking-wide">38</td>
                  <td className="py-4 px-6 font-light tracking-wide">6</td>
                  <td className="py-4 px-6 font-light tracking-wide">25.5</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">9</td>
                  <td className="py-4 px-6 font-light tracking-wide">39</td>
                  <td className="py-4 px-6 font-light tracking-wide">7</td>
                  <td className="py-4 px-6 font-light tracking-wide">26.5</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-light tracking-wide">10</td>
                  <td className="py-4 px-6 font-light tracking-wide">40</td>
                  <td className="py-4 px-6 font-light tracking-wide">8</td>
                  <td className="py-4 px-6 font-light tracking-wide">27.5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Jewelry Size Guide */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
            Jewelry
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                Rings
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">US Size 5</span>
                  <span className="font-light tracking-wide">15.7mm</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">US Size 6</span>
                  <span className="font-light tracking-wide">16.5mm</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">US Size 7</span>
                  <span className="font-light tracking-wide">17.3mm</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">US Size 8</span>
                  <span className="font-light tracking-wide">18.2mm</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                Bracelets
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">Small</span>
                  <span className="font-light tracking-wide">6.5" - 7"</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">Medium</span>
                  <span className="font-light tracking-wide">7" - 7.5"</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-light tracking-wide">Large</span>
                  <span className="font-light tracking-wide">7.5" - 8"</span>
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
            Still unsure about sizing? Contact us for personalized assistance
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

export default SizeGuide 