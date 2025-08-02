import { motion } from 'framer-motion'
import { useEffect } from 'react'

const AboutKolzo = () => {
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] overflow-hidden"
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
              About Kolzo
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Crafting luxury beauty and fashion since 2024
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Story Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 font-light tracking-wide leading-relaxed">
              <p>
                Founded in 2024, Kolzo emerged from a vision to create luxury beauty and fashion products that embody timeless elegance and modern sophistication.
              </p>
              <p>
                Our commitment to quality craftsmanship, sustainable practices, and innovative design has established Kolzo as a premier destination for those who appreciate the finer things in life.
              </p>
              <p>
                Every product in our collection is thoughtfully curated and meticulously crafted to meet the highest standards of luxury and performance.
              </p>
            </div>
          </div>
          
                     <div className="aspect-square overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
               alt="Luxury fashion store interior"
               className="w-full h-full object-cover"
             />
           </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-12 text-center">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Innovation
              </h3>
              <p className="text-gray-600 font-light tracking-wide">
                Pushing boundaries in beauty and fashion with cutting-edge formulations and designs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Quality
              </h3>
              <p className="text-gray-600 font-light tracking-wide">
                Uncompromising standards in every product, from ingredients to packaging.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-4">
                Sustainability
              </h3>
              <p className="text-gray-600 font-light tracking-wide">
                Committed to ethical practices and environmental responsibility in all we do.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-6">
            Connect With Us
          </h2>
          <p className="text-gray-600 font-light tracking-wide mb-8">
            Follow our journey and stay updated with the latest from Kolzo
          </p>
          <a
            href="https://www.instagram.com/kolzocosmetics"
            target="_blank"
            rel="noopener noreferrer"
                            className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
          >
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutKolzo 