import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/ProductCard'
import LuxuryLoadingSpinner from '../components/LuxuryLoadingSpinner'


// Temporary interfaces to avoid import issues
interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  gender?: 'men' | 'women' | 'unisex';
  image?: string;
  images?: string[];
  variants?: any[];
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  averageRating?: number;
  totalReviews?: number;
  salesCount?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}



const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [error, setError] = useState('')

  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    gender: '',
    price_min: '',
    price_max: ''
  })

  const { products, isLoading, searchProducts, pagination, recommendedProducts, error: searchError } = useProductStore()

  // Perform search function
  const performSearch = async () => {
    if (searchQuery.trim()) {
      await searchProducts(searchQuery.trim())
    }
  }

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, sortBy, filters])

  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [searchQuery, setSearchParams])



  const getSearchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([])
      return
    }

    try {
      // Search term to product ID mapping for suggestions
      const searchTermToProductIds: { [key: string]: string[] } = {
        // Lipstick variations (Women's)
        'lipstick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip stick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip-stick': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        'lip': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008'],
        
        // Handbag variations (Women's)
        'handbag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'hand bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'hand-bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        'bag': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008'],
        
        // Wallet variations (Men's)
        'wallet': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        'purse': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        'card holder': ['wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008'],
        
        // Bracelet variations (Men's)
        'bracelet': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        'bangle': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        'wrist band': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008'],
        
        // Perfume variations (Women's)
        'perfume': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        'fragrance': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        'cologne': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008'],
        
        // Watch variations (Men's)
        'watch': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        'timepiece': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        'wristwatch': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008'],
        
        // Compact variations (Women's)
        'compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        'powder compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        'mirror compact': ['cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008'],
        
        // Blush variations (Women's)
        'blush': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        'rouge': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        'cheek color': ['bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008'],
        
        // Eye Liner variations (Women's)
        'liner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'eyeliner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'eye liner': ['el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        
        // Scarf variations (Women's)
        'scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        'neck scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        'silk scarf': ['sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008'],
        
        // Face wash variations (Men's)
        'facewash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        'face wash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        'face-wash': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008'],
        
        // Sunscreen variations (Men's)
        'sunscreen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        'sun screen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        'sun-screen': ['ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008'],
        
        // Moisturiser variations (Men's)
        'moisturiser': ['ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        'moisturizer': ['ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        
        // Shaving kit variations (Men's)
        'shaving kit': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'shaving': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'razor': ['sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        
        // Lip Balm variations (Women's)
        'lip balm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        'lipbalm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        'balm': ['lb-001', 'lb-002', 'lb-003', 'lb-004', 'lb-005', 'lb-006', 'lb-007', 'lb-008'],
        
        // Men's Perfumes
        'men perfume': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'men fragrance': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'men cologne': ['pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        
        // Men's Handbags
        'men handbag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'men bag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'backpack': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'messenger bag': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        'briefcase': ['hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m'],
        
        // Women's Watches
        'women watch': ['wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'women timepiece': ['wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        
        // General category mappings
        'makeup': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'cosmetics': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'beauty': ['lp-001', 'lp-002', 'lp-003', 'lp-004', 'lp-005', 'lp-006', 'lp-007', 'lp-008', 'bl-001', 'bl-002', 'bl-003', 'bl-004', 'bl-005', 'bl-006', 'bl-007', 'bl-008', 'cp-001', 'cp-002', 'cp-003', 'cp-004', 'cp-005', 'cp-006', 'cp-007', 'cp-008', 'el-001', 'el-002', 'el-003', 'el-004', 'el-005', 'el-006', 'el-007', 'el-008'],
        'accessories': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008', 'wl-001', 'wl-002', 'wl-003', 'wl-004', 'wl-005', 'wl-006', 'wl-007', 'wl-008', 'br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'sc-001', 'sc-002', 'sc-003', 'sc-004', 'sc-005', 'sc-006', 'sc-007', 'sc-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'jewelry': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'jewellery': ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', 'br-007', 'br-008', 'wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'skincare': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008', 'ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008', 'ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008'],
        'grooming': ['fw-001', 'fw-002', 'fw-003', 'fw-004', 'fw-005', 'fw-006', 'fw-007', 'fw-008', 'ss-001', 'ss-002', 'ss-003', 'ss-004', 'ss-005', 'ss-006', 'ss-007', 'ss-008', 'ms-001', 'ms-002', 'ms-003', 'ms-004', 'ms-005', 'ms-006', 'ms-007', 'ms-008', 'sk-001', 'sk-002', 'sk-003', 'sk-004', 'sk-005', 'sk-006', 'sk-007', 'sk-008'],
        'fragrances': ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006', 'pf-007', 'pf-008', 'pm-001', 'pm-002', 'pm-003', 'pm-004', 'pm-005', 'pm-006', 'pm-007', 'pm-008'],
        'watches': ['wt-001', 'wt-002', 'wt-003', 'wt-004', 'wt-005', 'wt-006', 'wt-007', 'wt-008', 'wf-001', 'wf-002', 'wf-003', 'wf-004', 'wf-005', 'wf-006', 'wf-007', 'wf-008'],
        'handbags': ['hb-001', 'hb-002', 'hb-003', 'hb-004', 'hb-005', 'hb-006', 'hb-007', 'hb-008', 'hb-001-m', 'hb-002-m', 'hb-003-m', 'hb-004-m', 'hb-005-m', 'hb-006-m', 'hb-007-m', 'hb-008-m']
      }
      
      // Import product data for suggestions
      const productsData = await import('../data/products.json')
      const productsDataF = await import('../data/products-f.json')
      const productsDataM = await import('../data/products-m.json')
      
      // Combine all products
      const allProducts = [
        ...(productsData.default.featured || []),
        ...(productsData.default.women || []),
        ...(productsData.default.men || []),
        ...Object.values(productsDataF.default).flat(),
        ...Object.values(productsDataM.default).flat()
      ]
      
      // Generate suggestions based on ID mapping
      const suggestions = new Set<string>()
      const queryLower = query.toLowerCase()
      
      // Get matching product IDs
      const matchingProductIds = new Set<string>()
      
      // Direct term matching
      if (searchTermToProductIds[queryLower]) {
        searchTermToProductIds[queryLower].forEach(id => matchingProductIds.add(id))
      }
      
      // Partial word matching
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1)
      for (const word of queryWords) {
        if (searchTermToProductIds[word]) {
          searchTermToProductIds[word].forEach(id => matchingProductIds.add(id))
        }
      }
      
      // Normalized compound word matching
      const normalizedQuery = queryLower.replace(/\s+/g, '').replace(/[^\w]/g, '')
      for (const [term, productIds] of Object.entries(searchTermToProductIds)) {
        const normalizedTerm = term.replace(/\s+/g, '').replace(/[^\w]/g, '')
        if (normalizedTerm.includes(normalizedQuery) || normalizedQuery.includes(normalizedTerm)) {
          productIds.forEach(id => matchingProductIds.add(id))
        }
      }
      
      // Get product names and categories for suggestions
      allProducts.forEach(product => {
        if (matchingProductIds.has(product.id)) {
          suggestions.add(product.name)
          suggestions.add(product.category)
        }
      })
      
      // Add search terms that match the query
      Object.keys(searchTermToProductIds).forEach(term => {
        if (term.includes(queryLower) || queryLower.includes(term)) {
          suggestions.add(term)
        }
      })
      
      setSearchSuggestions(Array.from(suggestions).slice(0, 8))
    } catch (error) {
      console.error('Failed to get search suggestions:', error)
      setSearchSuggestions([])
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
    if (value.length >= 2) {
      getSearchSuggestions(value)
    } else {
      setSearchSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionClick(searchSuggestions[selectedSuggestionIndex])
      } else {
        performSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const clearSearch = async () => {
    setSearchQuery('')
    // Clear search results by calling searchProducts with empty string
    await searchProducts('')
    setSearchSuggestions([])
    setShowSuggestions(false)
    setError('')
    setFilters({
      category: '',
      brand: '',
      gender: '',
      price_min: '',
      price_max: ''
    })
    setSortBy('relevance')
  }





  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 z-50 p-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Search Header */}
      <motion.section
        className="relative h-[40vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury search"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Search Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
        <motion.div
            className="text-center px-6 w-full max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase mb-6">
              Search Collection
          </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-8">
              Discover our curated selection of luxury fashion and accessories
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => {
                  setShowSuggestions(true)
                }}
                onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false)
                }, 200)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search collection"
                className="w-full px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-500 font-light tracking-wide rounded-none"
              />
              
              {/* Search Icon */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

              {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          index === selectedSuggestionIndex ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="text-gray-700">{suggestion}</span>
                          </button>
                        ))}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Filters and Sort */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Results Count */}
          <div className="text-gray-600 font-light tracking-wide">
            {products.length > 0 ? (
              `${pagination.total} ${pagination.total === 1 ? 'result' : 'results'} found`
            ) : searchQuery && !isLoading ? (
              'No results found'
            ) : searchQuery && isLoading ? (
              'Searching...'
            ) : (
              'Enter a search term to begin'
            )}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
            >
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </motion.div>

        {/* Filters */}
          <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
          >
            <option value="">All Categories</option>
            <option value="Handbags">Handbags</option>
            <option value="Wallets">Wallets</option>
            <option value="Lipstick">Lipstick</option>
            <option value="Perfume">Perfume</option>
          </select>

          <select
            value={filters.brand}
            onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
          >
            <option value="">All Brands</option>
            <option value="Kolzo">Kolzo</option>
            <option value="Luxury">Luxury</option>
          </select>

          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
          >
            <option value="">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.price_min}
            onChange={(e) => setFilters(prev => ({ ...prev, price_min: e.target.value }))}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.price_max}
            onChange={(e) => setFilters(prev => ({ ...prev, price_max: e.target.value }))}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide focus:outline-none focus:border-black transition-all duration-300"
          />
        </motion.div>

        {/* Loading State */}
        {isLoading && searchQuery && (
          <div className="flex justify-center py-20">
            <LuxuryLoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Search Results Grid */}
        {products.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {products.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product} 
                    showQuickAdd={true}
                    showWishlist={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Recommended Products Section */}
            {recommendedProducts.length > 0 && (
              <motion.div
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-light tracking-[0.1em] mb-4 text-center">
                    Recommended for You
                  </h2>
                  <p className="text-gray-600 text-center font-light tracking-wide">
                    Based on your search for "{searchQuery}"
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {recommendedProducts.map((product: Product, index: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard 
                        product={product} 
                        showQuickAdd={true}
                        showWishlist={true}
                        className="text-sm"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

                {/* Error Display */}
        {searchError && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl font-light tracking-[0.1em] mb-4 text-red-600">
                Search Error
              </h2>
              <p className="text-gray-600 mb-8 font-light tracking-wide">
                {searchError}
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-colors duration-300"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {!searchError && products.length === 0 && searchQuery && !isLoading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-light tracking-[0.1em] mb-4">No results found</h2>
              <p className="text-gray-600 mb-8 font-light tracking-wide">
                We couldn't find any products matching "{searchQuery}"
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-500 font-light tracking-wide">Try:</p>
              <ul className="text-sm text-gray-600 font-light tracking-wide space-y-2">
                <li>• Checking your spelling</li>
                <li>• Using more general keywords</li>
                <li>• Removing filters</li>
                <li>• Browsing our categories</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-black text-white font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
              >
                Clear Search
              </button>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
                        <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              {pagination.page > 1 && (
                <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide hover:border-black transition-all duration-300">
                  Previous
                </button>
              )}
              
              <span className="px-4 py-2 text-gray-600 font-light tracking-wide">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              {pagination.page < pagination.pages && (
                <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-light tracking-wide hover:border-black transition-all duration-300">
                  Next
                </button>
              )}
            </div>
            </motion.div>
          )}
      </div>
    </div>
  )
}

export default Search