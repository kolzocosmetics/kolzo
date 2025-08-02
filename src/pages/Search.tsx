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

  const categories = ['all', 'handbags', 'shoes', 'perfumes', 'lipstick', 'blush', 'compact', 'lip balm', 'wallet', 'fragrance', 'belts', 'face wash', 'backpacks', 'sunglasses', 'shaving kit']

  const trendingSearches = ['Handbags', 'Lipsticks', 'Perfumes', 'Wallets', 'Fragrances', 'Blush', 'Shoes', 'Accessories']

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Search Interface */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* Search Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-xl font-light tracking-[0.3em] uppercase mb-8">
            What are you looking for?
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-0 py-6 text-lg font-light tracking-wide border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 transition-all duration-500"
              autoFocus
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Trending Searches */}
        {!searchQuery && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xs font-light tracking-[0.2em] uppercase mb-8 text-gray-400">
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-6">
              {trendingSearches.map((term, index) => (
                <motion.button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="text-sm font-light tracking-wide text-gray-500 hover:text-black transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (index * 0.05) }}
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {!searchQuery && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xs font-light tracking-[0.2em] uppercase mb-8 text-gray-400">
              New In
            </h3>
            <div className="flex gap-12">
              <Link to="/collections/women" className="text-sm font-light tracking-wide text-gray-500 hover:text-black transition-all duration-300">
                Women
              </Link>
              <Link to="/collections/men" className="text-sm font-light tracking-wide text-gray-500 hover:text-black transition-all duration-300">
                Men
              </Link>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Results Count */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm text-gray-400 font-light tracking-wide">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
              </motion.div>

              {/* Simple Filters */}
              {searchResults.length > 0 && (
                <motion.div
                  className="flex justify-center mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm font-light tracking-wide border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 transition-all duration-500 px-0 py-2"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </motion.div>
              )}

              {/* Results Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
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
                        <div className="aspect-square bg-gray-50 mb-6 overflow-hidden">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        
                        <h4 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2 font-light tracking-wide">{product.category}</p>
                        <p className="font-light">${product.price.toLocaleString()}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg className="w-12 h-12 mx-auto text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-sm font-light tracking-[0.1em] mb-4">No results found</h3>
                  <p className="text-gray-400 font-light tracking-wide mb-8">Try searching with different keywords</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm font-light tracking-wide text-gray-500 hover:text-black transition-all duration-300"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Search