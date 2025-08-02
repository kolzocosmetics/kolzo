import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productsData from '../data/products.json'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    // Combine all products from different categories
    const combinedProducts = [
      ...productsData.featured,
      ...productsData.women,
      ...productsData.men
    ]
    setAllProducts(combinedProducts)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
    } else {
      let filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'name':
            return a.name.localeCompare(b.name)
          case 'relevance':
          default:
            return 0
        }
      })

      setSearchResults(filtered)
    }
  }, [searchQuery, allProducts, selectedCategory, sortBy])

  const openSearch = () => setIsOpen(true)
  const closeSearch = () => {
    setIsOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const categories = ['all', 'handbags', 'shoes', 'perfumes', 'lipstick', 'blush', 'compact', 'lip balm', 'wallet', 'fragrance', 'belts', 'face wash', 'backpacks', 'sunglasses', 'shaving kit']

  // This component can be triggered from Navbar or used as a page
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury fashion search"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase mb-4">
              Search Kolzo
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Discover our curated collection of luxury items
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search Interface */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for products, categories, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-6 text-lg font-light tracking-wide border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-500"
                autoFocus
              />
              <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <span className="text-sm font-light tracking-[0.1em] uppercase text-gray-600 mr-4">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-light tracking-wide border transition-all duration-500 ${
                    selectedCategory === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-600 hover:text-black'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 text-sm font-light tracking-wide border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 font-light tracking-wide">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {searchResults.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {searchResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="group"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="block"
                        >
                          <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          
                          <h4 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2 font-light tracking-wide">{product.category}</p>
                          <p className="font-medium">${product.price.toLocaleString()}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-light tracking-[0.1em] mb-4">No results found</h3>
                  <p className="text-gray-500 font-light tracking-wide mb-8">Try searching with different keywords or adjusting your filters</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-block bg-black text-white px-6 py-3 text-sm font-light tracking-[0.1em] uppercase hover:bg-gray-800 transition-all duration-500"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Searches (when no query) */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-light tracking-[0.1em] uppercase mb-8">Popular Searches</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Handbags', 'Lipsticks', 'Perfumes', 'Wallets', 'Fragrances', 'Blush', 'Shoes', 'Accessories'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-light tracking-wide hover:bg-gray-200 transition-all duration-500"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search