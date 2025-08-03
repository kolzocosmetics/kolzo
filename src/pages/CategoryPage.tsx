import { motion } from 'framer-motion'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import productsDataF from '../data/products-f.json'
import productsDataM from '../data/products-m.json'
import QuickViewModal from '../components/QuickViewModal'
import { luxuryAnimations } from '../utils/luxuryAnimations'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { trackWishlistAdd, trackWishlistRemove } from '../utils/analytics'
import SEOHead from '../components/SEOHead'
import { formatPrice } from '../utils/priceFormatter'

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
  const [searchParams] = useSearchParams()
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [didYouMean, setDidYouMean] = useState<string>('')
  
  // Quick view modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => 
    gender === 'women' 
      ? ['Handbags', 'Lipstick', 'Scarf', 'Blush', 'Lip Balm', 'Perfumes', 'Eye Liner', 'Compact', 'Watches']
      : ['Wallet', 'Bracelets', 'Perfumes', 'Handbags', 'Watches', 'Moisturiser', 'Face Wash', 'Sunscreen', 'Shaving Kit'],
    [gender]
  )

  useEffect(() => {
    const productsData = gender === 'women' ? productsDataF : productsDataM
    const allProducts = Object.values(productsData).flat()
    setProducts(allProducts)
    
    // Check for category parameter in URL
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setFilterBy(categoryParam)
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [gender, searchParams])

  // Reset selected suggestion when search query changes
  useEffect(() => {
    setSelectedSuggestionIndex(-1)
  }, [searchQuery])

  // Memoize the fuzzy search function
  const fuzzySearch = useCallback((text: string, query: string): boolean => {
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '')
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    if (normalizedText.includes(normalizedQuery)) return true
    
    // Check for character transpositions and typos
    let queryIndex = 0
    let textIndex = 0
    let errors = 0
    const maxErrors = Math.floor(normalizedQuery.length * 0.3) // Allow 30% error tolerance
    
    while (queryIndex < normalizedQuery.length && textIndex < normalizedText.length) {
      if (normalizedQuery[queryIndex] === normalizedText[textIndex]) {
        queryIndex++
        textIndex++
      } else {
        errors++
        if (errors > maxErrors) return false
        
        // Try to find the character later in the text
        const nextOccurrence = normalizedText.indexOf(normalizedQuery[queryIndex], textIndex)
        if (nextOccurrence !== -1 && nextOccurrence - textIndex <= 2) {
          textIndex = nextOccurrence
        } else {
          textIndex++
        }
      }
    }
    
    return queryIndex === normalizedQuery.length
  }, [])

  // Memoize the highlight search term function
  const highlightSearchTerm = useCallback((text: string, query: string) => {
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
  }, [])

  // Memoize filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Apply category filter
    if (filterBy) {
      filtered = filtered.filter(product => product.category === filterBy)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        fuzzySearch(product.name, searchQuery) ||
        fuzzySearch(product.description, searchQuery)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return filtered
    }
  }, [products, filterBy, searchQuery, sortBy, fuzzySearch])

  // Memoize search suggestions generation
  const generateSearchSuggestions = useCallback((query: string) => {
    if (query.length < 1) return []
    
    const suggestions = new Set<string>()
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    products.forEach(product => {
      // Product name suggestions with fuzzy matching
      const nameWords = product.name.toLowerCase().split(' ')
      nameWords.forEach(word => {
        const normalizedWord = word.replace(/[^a-z0-9]/g, '')
        if (fuzzySearch(word, query) || normalizedWord.includes(normalizedQuery)) {
          suggestions.add(word.charAt(0).toUpperCase() + word.slice(1))
        }
      })
      
      // Category suggestions with fuzzy matching
      if (fuzzySearch(product.category, query) || product.category.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(product.category)
      }
    })
    
    return Array.from(suggestions).slice(0, 8)
  }, [products, fuzzySearch])

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const suggestions = generateSearchSuggestions(searchQuery)
        setSearchSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } else {
        setSearchSuggestions([])
        setShowSuggestions(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, generateSearchSuggestions])

  // Quick add to cart function
  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
    
    // Show success feedback
    alert(`${product.name} added to cart!`) // Simple feedback for now
  }





  const heroImage = gender === 'women' 
    ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    : 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

  const categoryParam = searchParams.get('category')
  const categoryTitle = categoryParam ? `${categoryParam} - ${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection` : `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`
  const categoryDescription = categoryParam 
    ? `Shop luxury ${categoryParam.toLowerCase()} from KOLZO's ${gender}'s collection. Premium quality, designer ${categoryParam.toLowerCase()}, free shipping on orders over ₹16,600.`
    : `Discover KOLZO's luxury ${gender}'s collection. Shop designer handbags, premium accessories, luxury makeup, and sophisticated lifestyle products.`

  return (
    <>
      <SEOHead 
        title={`${categoryTitle} - KOLZO Luxury Fashion`}
        description={categoryDescription}
        keywords={`${gender}'s fashion, luxury ${gender}'s collection, designer ${gender}'s accessories, kolzo ${gender}, premium ${gender}'s fashion, luxury brands`}
        image="https://kolzo.in/assets/kolzo_logo.png"
        type="category"
      />
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
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Discover our curated selection of luxury {gender}'s items crafted with unparalleled attention to detail.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Enhanced Search and Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Sophisticated Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, categories, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchQuery(value)
                    setSearchSuggestions(generateSearchSuggestions(value))
                    setShowSuggestions(value.length >= 1)
                  }}
                  onFocus={() => {
                    setShowSuggestions(searchQuery.length >= 1)
                  }}
                  onBlur={() => {
                    setTimeout(() => {
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
                  className="w-full px-12 py-5 text-sm font-light tracking-wide border-2 border-gray-200 bg-white focus:outline-none focus:border-black focus:ring-0 transition-all duration-500 rounded-none"
                />
                
                {/* Search Icon */}
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Clear Button */}
                {searchQuery && (
                  <motion.button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchSuggestions([])
                      setShowSuggestions(false)
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all duration-300"
                    whileHover={luxuryAnimations.icon.hover}
                    whileTap={luxuryAnimations.icon.tap}
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                <motion.div
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Recent Searches */}
                  {searchHistory.length > 0 && searchQuery === '' && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-500 mb-2">Recent Searches</div>
                      {searchHistory.slice(0, 3).map((term, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setSearchQuery(term)
                            setShowSuggestions(false)
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-200"
                          whileHover={{ x: 8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {term}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                  
                  {/* Search Suggestions */}
                  {searchSuggestions.length > 0 && (
                    <div className="p-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">Suggestions</div>
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setShowSuggestions(false)
                            setSelectedSuggestionIndex(-1)
                            // Add to search history
                            if (!searchHistory.includes(suggestion)) {
                              setSearchHistory(prev => [suggestion, ...prev.slice(0, 4)])
                            }
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                            index === selectedSuggestionIndex 
                              ? 'bg-gray-100 text-black' 
                              : 'hover:bg-gray-50'
                          }`}
                          whileHover={{ x: 8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {suggestion}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Search Status */}
              {searchQuery && (
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                                     <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                     <span className="text-xs text-gray-600 font-light">
                       Found {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} for "{searchQuery}"
                     </span>
                     {filteredAndSortedProducts.length > 0 && (
                       <span className="text-xs text-gray-400">
                         • {Math.round((filteredAndSortedProducts.length / products.length) * 100)}% of collection
                       </span>
                     )}
                   </div>
                   
                   {/* Did you mean? suggestion */}
                   {didYouMean && filteredAndSortedProducts.length === 0 && (
                     <motion.div
                       className="mt-3 text-center"
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.3, delay: 0.1 }}
                     >
                       <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                         <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <span className="text-xs text-blue-600 font-light">
                           Did you mean: "
                         </span>
                         <button
                           onClick={() => {
                             setSearchQuery(didYouMean)
                             setDidYouMean('')
                           }}
                           className="text-xs text-blue-800 font-medium underline hover:no-underline"
                         >
                           {didYouMean}
                         </button>
                         <span className="text-xs text-blue-600 font-light">"?</span>
                       </div>
                     </motion.div>
                   )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Enhanced Filters and Sort */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Enhanced Category Filter */}
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setFilterBy(category)}
                  className={`px-4 lg:px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                    category.toLowerCase() === filterBy.toLowerCase()
                      ? 'bg-gray-100 text-black border-gray-400 shadow-sm font-medium'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  whileHover={luxuryAnimations.button.hover}
                  whileTap={luxuryAnimations.button.tap}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-light tracking-wide text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 text-sm font-light tracking-wide border-2 border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Results Count */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center space-x-4 bg-gray-50 px-6 py-3">
            <span className="text-sm font-light tracking-wide text-gray-600">
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
            </span>
            {(searchQuery || filterBy) && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-light">
                  {searchQuery && `Search: "${searchQuery}"`}
                  {searchQuery && filterBy && ' • '}
                  {filterBy && `Category: ${filterBy}`}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Products Grid */}
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
                whileHover={luxuryAnimations.productCard.hover}
                whileTap={luxuryAnimations.productCard.tap}
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative border border-gray-100">
                      {/* Product Image */}
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={luxuryAnimations.image.hover}
                      />
                      
                      {/* Wishlist button */}
                      <motion.button 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id)
                            trackWishlistRemove(product.id, product.name)
                            alert('Removed from wishlist!')
                          } else {
                            addToWishlist(product)
                            trackWishlistAdd(product.id, product.name)
                            alert('Added to wishlist!')
                          }
                        }}
                        className={`absolute top-4 right-4 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg ${
                          isInWishlist(product.id)
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'bg-white/90 backdrop-blur-sm hover:bg-gray-100'
                        }`}
                        whileHover={luxuryAnimations.icon.hover}
                        whileTap={luxuryAnimations.icon.tap}
                      >
                        <svg className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-700 fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </motion.button>

                      {/* Quick Add to Cart button */}
                      <motion.button 
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        className="absolute top-4 left-4 p-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-800 shadow-lg border-2 border-white"
                        whileHover={luxuryAnimations.icon.hover}
                        whileTap={luxuryAnimations.icon.tap}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                        {searchQuery ? highlightSearchTerm(product.name, searchQuery) : product.name}
                      </h3>
                                                  <p className="text-lg font-medium mb-2">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-500 font-light tracking-wide mb-3">
                        {searchQuery ? highlightSearchTerm(product.category, searchQuery) : product.category}
                      </p>
                      <div className="w-8 h-px bg-gray-300 mx-auto opacity-50"></div>
                    </div>
                  </Link>
                  
                  {/* Quick View Button */}
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setQuickViewProduct(product)
                      setIsQuickViewOpen(true)
                    }}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-black text-white text-xs font-light tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-800"
                    whileHover={luxuryAnimations.button.hover}
                    whileTap={luxuryAnimations.button.tap}
                  >
                    Quick View
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-md mx-auto">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-light tracking-[0.1em] mb-4 text-gray-600">No products found</h3>
                <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
                  {searchQuery 
                    ? `No products match "${searchQuery}". Try different keywords or browse all categories.`
                    : filterBy 
                    ? `No products in the "${filterBy}" category. Try another category or clear filters.`
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {searchQuery && (
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 text-sm font-light tracking-wide border border-gray-300 hover:border-black transition-all duration-500"
                      whileHover={luxuryAnimations.button.hover}
                      whileTap={luxuryAnimations.button.tap}
                    >
                      Clear Search
                    </motion.button>
                  )}
                  {filterBy && (
                    <motion.button
                      onClick={() => setFilterBy('')}
                      className="px-6 py-3 text-sm font-light tracking-wide border border-gray-300 hover:border-black transition-all duration-500"
                      whileHover={luxuryAnimations.button.hover}
                      whileTap={luxuryAnimations.button.tap}
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setQuickViewProduct(null)
        }}
      />
      </div>
    </>
  )
}

export default CategoryPage