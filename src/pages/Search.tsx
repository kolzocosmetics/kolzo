import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import productsDataF from '../data/products-f.json'
import productsDataM from '../data/products-m.json'

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
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [didYouMean, setDidYouMean] = useState<string | null>(null)

  const [sortBy, setSortBy] = useState('relevance')

  // Fuzzy search function with typo tolerance
  const fuzzySearch = (text: string, query: string): boolean => {
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    if (normalizedText.includes(normalizedQuery)) return true
    
    let queryIndex = 0
    let textIndex = 0
    let errors = 0
    const maxErrors = Math.floor(normalizedQuery.length * 0.3)
    
    while (queryIndex < normalizedQuery.length && textIndex < normalizedText.length) {
      if (normalizedQuery[queryIndex] === normalizedText[textIndex]) {
        queryIndex++
        textIndex++
      } else {
        errors++
        if (errors > maxErrors) return false
        const nextOccurrence = normalizedText.indexOf(normalizedQuery[queryIndex], textIndex)
        if (nextOccurrence !== -1 && nextOccurrence - textIndex <= 2) {
          textIndex = nextOccurrence
        } else {
          textIndex++
        }
      }
    }
    return queryIndex === normalizedQuery.length
  }

  // Generate sophisticated search suggestions
  const generateSearchSuggestions = (query: string) => {
    if (query.length < 1) return []
    
    const suggestions = new Set<string>()
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    allProducts.forEach(product => {
      // Product name suggestions with fuzzy matching
      const nameWords = product.name.toLowerCase().split(' ')
      nameWords.forEach(word => {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '')
        if (fuzzySearch(word, query) || normalizedWord.includes(normalizedQuery)) {
          suggestions.add(word.charAt(0).toUpperCase() + word.slice(1))
        }
      })
      
      // Category suggestions with fuzzy matching
      if (fuzzySearch(product.category, query)) {
        suggestions.add(product.category)
      }
      
      // Description keywords with fuzzy matching
      const descWords = product.description.toLowerCase().split(' ')
      descWords.forEach(word => {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '')
        if (word.length > 2 && (fuzzySearch(word, query) || normalizedWord.includes(normalizedQuery))) {
          suggestions.add(word.charAt(0).toUpperCase() + word.slice(1))
        }
      })
      
      // Brand name suggestions
      if (fuzzySearch('kolzo', query)) {
        suggestions.add('Kolzo')
      }
    })
    
    // Add common search terms
    const commonTerms = ['bag', 'handbag', 'lipstick', 'perfume', 'watch', 'blush', 'compact', 'liner', 'balm', 'wallet', 'bracelet', 'moisturiser', 'facewash', 'sunscreen', 'shaving']
    commonTerms.forEach(term => {
      if (fuzzySearch(term, query)) {
        suggestions.add(term.charAt(0).toUpperCase() + term.slice(1))
      }
    })
    
    // Check for "Did you mean?" suggestions
    const typoMap: { [key: string]: string } = {
      'lipstik': 'lipstick',
      'handbag': 'handbag',
      'perfum': 'perfume',
      'watche': 'watch',
      'blushe': 'blush',
      'compacte': 'compact',
      'linere': 'liner',
      'balme': 'balm',
      'wallete': 'wallet',
      'bracelete': 'bracelet',
      'moisturiser': 'moisturiser',
      'facewash': 'facewash',
      'sunscreene': 'sunscreen',
      'shavinge': 'shaving',
      'kolzoo': 'kolzo',
      'kolz': 'kolzo'
    }
    
    if (typoMap[query.toLowerCase()]) {
      setDidYouMean(typoMap[query.toLowerCase()])
    } else {
      setDidYouMean(null)
    }
    
    return Array.from(suggestions).slice(0, 10)
  }

  // Highlight search terms in text
  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-100 font-medium">
          {part}
        </span>
      ) : part
    )
  }

  useEffect(() => {
    // Combine all products from different categories
    const combinedProducts = [
      ...Object.values(productsDataF).flat(),
      ...Object.values(productsDataM).flat()
    ]
    setAllProducts(combinedProducts)
  }, [])

  // Reset selected suggestion when search query changes
  useEffect(() => {
    setSelectedSuggestionIndex(-1)
  }, [searchQuery])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setShowSuggestions(false)
    } else {
      // Generate suggestions
      const suggestions = generateSearchSuggestions(searchQuery)
      setSearchSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0 && isSearchFocused)
      
      // Filter products with fuzzy search
      let filtered = allProducts.filter(product =>
        fuzzySearch(product.name, searchQuery) ||
        fuzzySearch(product.category, searchQuery) ||
        fuzzySearch(product.description, searchQuery)
      )

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
  }, [searchQuery, allProducts, sortBy, isSearchFocused])



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

        {/* Enhanced Search Bar */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, categories, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true)
                if (searchQuery.trim()) {
                  setShowSuggestions(true)
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsSearchFocused(false)
                  setShowSuggestions(false)
                }, 200)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setSelectedSuggestionIndex(prev => 
                    prev < searchSuggestions.length - 1 ? prev + 1 : prev
                  )
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                  if (selectedSuggestionIndex >= 0 && searchSuggestions[selectedSuggestionIndex]) {
                    // Select highlighted suggestion
                    const suggestion = searchSuggestions[selectedSuggestionIndex]
                    setSearchQuery(suggestion)
                    setShowSuggestions(false)
                    setSelectedSuggestionIndex(-1)
                    if (!searchHistory.includes(suggestion)) {
                      setSearchHistory(prev => [suggestion, ...prev.slice(0, 4)])
                    }
                  } else {
                    // Perform search with current query
                    setShowSuggestions(false)
                    setSelectedSuggestionIndex(-1)
                    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
                      setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 4)])
                    }
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false)
                  setSelectedSuggestionIndex(-1)
                }
              }}
              className="w-full px-0 py-6 text-lg font-light tracking-wide border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-black transition-all duration-500"
              autoFocus
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 mb-3">Recent Searches</h4>
                      <div className="space-y-2">
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(term)
                              setShowSuggestions(false)
                            }}
                            className="block w-full text-left text-sm font-light tracking-wide text-gray-600 hover:text-black transition-colors duration-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Suggestions */}
                  <div className="p-4">
                    <h4 className="text-xs font-light tracking-[0.2em] uppercase text-gray-400 mb-3">Suggestions</h4>
                    <div className="space-y-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setShowSuggestions(false)
                            if (!searchHistory.includes(suggestion)) {
                              setSearchHistory(prev => [suggestion, ...prev.slice(0, 4)])
                            }
                          }}
                          className={`block w-full text-left text-sm font-light tracking-wide transition-colors duration-200 ${
                            index === selectedSuggestionIndex 
                              ? 'text-black bg-gray-50' 
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              {/* Results Count and Did You Mean */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {didYouMean && searchResults.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400 font-light tracking-wide">
                      No results found for "{searchQuery}"
                    </p>
                    <div>
                      <p className="text-sm text-gray-500 font-light tracking-wide mb-2">
                        Did you mean:
                      </p>
                      <button
                        onClick={() => setSearchQuery(didYouMean)}
                        className="text-sm font-light tracking-wide text-black hover:text-gray-600 transition-colors duration-300 underline"
                      >
                        {didYouMean}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 font-light tracking-wide">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                    {searchQuery && (
                      <span className="ml-2">
                        for "{searchQuery}"
                      </span>
                    )}
                  </p>
                )}
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
                          {highlightSearchTerm(product.name, searchQuery)}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2 font-light tracking-wide">
                          {highlightSearchTerm(product.category, searchQuery)}
                        </p>
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