import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import productsData from '../data/products.json'

interface CategoryPageProps {
  gender: 'women' | 'men'
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

const CategoryPage = ({ gender }: CategoryPageProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const genderProducts = productsData[gender] || []
    setProducts(genderProducts)
  }, [gender])

  const categories = gender === 'women' 
    ? ['All', 'Handbags', 'Shoes', 'Perfumes', 'Lipstick', 'Blush', 'Compact', 'Lip Balm', 'Wallet']
    : ['All', 'Fragrance', 'Wallet', 'Belts', 'Face Wash', 'Backpacks', 'Shoes', 'Sunglasses', 'Shaving Kit']

  // Enhanced filtering and sorting
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = filterBy === 'all' || product.category.toLowerCase() === filterBy.toLowerCase()
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return 0 // Keep original order for newest
      }
    })

  const heroImage = gender === 'women' 
    ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    : 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Model */}
      <motion.section
        className="relative h-[60vh] md:h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt={`${gender}'s luxury collection`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase mb-6">
              {gender}'s Collection
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-8">
              Discover our curated selection of luxury {gender}'s items crafted with unparalleled attention to detail.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to={`/collections/${gender === 'women' ? 'women' : 'men'}`}
                className="inline-block bg-white text-black px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
              >
                Shop Now
              </Link>
              <button className="inline-block border border-white text-white px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500">
                View Lookbook
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-sm font-light tracking-wide border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-500"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterBy(category === 'All' ? 'all' : category)}
                  className={`px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                    (category === 'All' && filterBy === 'all') || 
                    category.toLowerCase() === filterBy.toLowerCase()
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-600 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 text-sm font-light tracking-wide border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-500"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-600 font-light tracking-wide">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative">
                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500" />
                    
                    {/* Wishlist button */}
                    <motion.button 
                      className="absolute top-4 right-4 p-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                      {product.name}
                    </h3>
                    <p className="text-lg font-medium">${product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-light mb-4">No products found</p>
              <p className="text-gray-400 text-sm font-light">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default CategoryPage