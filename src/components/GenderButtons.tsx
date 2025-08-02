import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import womensCollection from '../assets/homepage/womens_collection.webp'
import mensCollection from '../assets/homepage/mens_collection.webp'

const GenderButtons = () => {
  return (
    <section className="py-32 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-gray-300 mr-6"></div>
            <h2 className="text-4xl md:text-5xl font-light tracking-[0.4em] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
              Discover Your Style
            </h2>
            <div className="w-16 h-px bg-gray-300 ml-6"></div>
          </div>
          <p className="text-gray-500 font-light tracking-wide max-w-2xl mx-auto text-sm">
            Explore our curated collections designed for the modern individual
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Women's Collection */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Link to="/collections/women">
              <motion.div
                className="group relative h-[600px] lg:h-[700px] bg-transparent overflow-hidden cursor-pointer"
                transition={{ 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {/* Background Image - Women's Luxury Fashion */}
                <div className="absolute inset-0">
                  <img 
                    src={womensCollection}
                    alt="Women's luxury collection"
                    className="w-full h-full object-cover object-center transition-transform duration-1000"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-black/15 group-hover:to-transparent transition-all duration-700" />
                
                {/* Subtle Border */}
                <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <motion.h3
                      className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.4em] uppercase mb-8"
                      whileHover={{ scale: 1.05 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      Women
                    </motion.h3>
                    
                    <motion.div
                      className="text-center text-white/90"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <motion.div
                        className="inline-block border-b border-white/60 pb-2 group-hover:border-white transition-all duration-500 relative overflow-hidden"
                        whileHover={{ borderBottomWidth: 2 }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        <span className="text-sm font-light tracking-[0.3em] uppercase group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-500 relative z-10">
                          Shop Women
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Men's Collection */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Link to="/collections/men">
              <motion.div
                className="group relative h-[600px] lg:h-[700px] bg-transparent overflow-hidden cursor-pointer"
                transition={{ 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {/* Background Image - Men's Luxury Fashion */}
                <div className="absolute inset-0">
                  <img 
                    src={mensCollection}
                    alt="Men's luxury collection"
                    className="w-full h-full object-cover object-center transition-transform duration-1000"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 group-hover:via-black/15 group-hover:to-transparent transition-all duration-700" />
                
                {/* Subtle Border */}
                <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <motion.h3
                      className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.4em] uppercase mb-8"
                      whileHover={{ scale: 1.05 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      Men
                    </motion.h3>
                    
                    <motion.div
                      className="text-center text-white/90"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <motion.div
                        className="inline-block border-b border-white/60 pb-2 group-hover:border-white transition-all duration-500 relative overflow-hidden"
                        whileHover={{ borderBottomWidth: 2 }}
                        transition={{ 
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        <span className="text-sm font-light tracking-[0.3em] uppercase group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-500 relative z-10">
                          Shop Men
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default GenderButtons