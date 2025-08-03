import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import womensShoulderBags from '../assets/homepage/womens_shoulder_bags.webp'
import womensLipstick from '../assets/homepage/womens_lipstick.webp'
import mensWallet from '../assets/homepage/mens_wallet.webp'
import mensBracelets from '../assets/homepage/mens_bracelets.webp'

const collections = [
  {
    id: 'womens-shoulder-bags',
    name: "Women's Shoulder Bags",
    subtitle: "Timeless elegance",
    image: womensShoulderBags,
    link: '/collections/women?category=Handbags'
  },
  {
    id: 'womens-lipstick', 
    name: "Women's Lipstick",
    subtitle: "Bold sophistication",
    image: womensLipstick,
    link: '/collections/women?category=Lipstick'
  },
  {
    id: 'mens-wallet',
    name: "Men's Wallet",
    subtitle: "Refined luxury",
    image: mensWallet,
    link: '/collections/men?category=Wallet'
  },
  {
    id: 'mens-bracelets',
    name: "Men's Bracelets",
    subtitle: "Sophisticated style",
    image: mensBracelets,
    link: '/collections/men?category=Bracelets'
  }
]

const FeaturedCollections = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <section className="py-32 px-8 max-w-7xl mx-auto bg-white">
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
            Curated by the House
          </h2>
          <div className="w-16 h-px bg-gray-300 ml-6"></div>
        </div>
        <p className="text-gray-500 font-light tracking-wide max-w-2xl mx-auto text-sm">
                          Since 2025, each piece embodies the essence of timeless luxury
        </p>
      </motion.div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onHoverStart={() => setHoveredItem(collection.id)}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <Link to={collection.link}>
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                {/* Product Image */}
                <motion.img
                  src={collection.image}
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ 
                    scale: hoveredItem === collection.id ? 1.05 : 1,
                    filter: hoveredItem === collection.id ? 'brightness(1.02)' : 'brightness(1)'
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
                
                {/* Subtle Vintage Border */}
                <div className="absolute inset-0 border border-gray-200 opacity-30"></div>
                
                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredItem === collection.id ? 0.1 : 0 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />

                {/* Hover Text Overlay */}
                <motion.div
                  className="absolute inset-0 flex items-end p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredItem === collection.id ? 1 : 0 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <div className="text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: hoveredItem === collection.id ? 0 : 20, opacity: hoveredItem === collection.id ? 1 : 0 }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <p className="text-sm font-light tracking-[0.2em] uppercase mb-2">
                        {collection.subtitle}
                      </p>
                      <p className="text-xs font-light tracking-wide opacity-80">
                        Explore Collection
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Collection Name */}
              <motion.div
                className="mt-8 text-center"
                animate={{ 
                  opacity: hoveredItem === collection.id ? 0.8 : 1
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-400 font-light tracking-wide">
                  {collection.subtitle}
                </p>
                <div className="w-8 h-px bg-gray-300 mx-auto mt-4 opacity-50"></div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCollections