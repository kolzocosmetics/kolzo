import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const collections = [
  {
    id: 'handbags',
    name: "Women's Shoulder Bags",
    subtitle: "Timeless elegance",
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    link: '/collections/women'
  },
  {
    id: 'shoes', 
    name: "Women's Summer Shoes",
    subtitle: "Effortless style",
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    link: '/collections/women'
  },
  {
    id: 'mens-shoes',
    name: "Men's Summer Shoes",
    subtitle: "Sophisticated comfort",
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    link: '/collections/men'
  },
  {
    id: 'mens-bags',
    name: "Men's Bags",
    subtitle: "Refined luxury",
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    link: '/collections/men'
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
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-px bg-gray-300 mr-6"></div>
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.4em] uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
            Curated by the House
          </h2>
          <div className="w-16 h-px bg-gray-300 ml-6"></div>
        </div>
        <p className="text-gray-500 font-light tracking-wide max-w-2xl mx-auto text-sm">
          Since 2024, each piece embodies the essence of timeless luxury
        </p>
      </motion.div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            viewport={{ once: true }}
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