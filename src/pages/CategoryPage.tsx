import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams, useParams } from 'react-router-dom'
import productsDataF from '../data/products-f.json'
import productsDataM from '../data/products-m.json'
import QuickViewModal from '../components/QuickViewModal'
import { luxuryAnimations } from '../utils/luxuryAnimations'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { trackWishlistAdd, trackWishlistRemove } from '../utils/analytics'
import SEOHead from '../components/SEOHead'
import { formatPrice } from '../utils/priceFormatter'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

const CategoryPage = () => {
  const { gender } = useParams<{ gender: 'women' | 'men' }>()
  const [searchParams] = useSearchParams()
  
  // Default to 'women' if gender is not provided
  const currentGender = gender || 'women'
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('')
  
  // Quick view modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => 
    currentGender === 'women' 
      ? ['Handbags', 'Lipstick', 'Scarf', 'Blush', 'Lip Balm', 'Perfumes', 'Eye Liner', 'Compact', 'Watches']
      : ['Wallet', 'Bracelets', 'Perfumes', 'Handbags', 'Watches', 'Moisturiser', 'Face Wash', 'Sunscreen', 'Shaving Kit'],
    [currentGender]
  )

  useEffect(() => {
    const productsData = currentGender === 'women' ? productsDataF : productsDataM
    // Properly flatten the nested product structure - each category contains an array of products
    const allProducts = Object.values(productsData).flat()
    
    // Always load all products, filtering will be handled by the UI
    setProducts(allProducts)
    
    // Check for category parameter in URL and set the filter
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setFilterBy(categoryParam)
    } else {
      setFilterBy('')
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [currentGender, searchParams])



  // Memoize filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Apply category filter
    if (filterBy && filterBy.trim()) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filterBy.toLowerCase()
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
  }, [products, filterBy, sortBy])





  // Quick add to cart function
  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    
                    addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            category: product.category
          }, 1, 'Medium', 'Black')
    
    // Show success feedback
    alert(`${product.name} added to cart!`) // Simple feedback for now
  }





  const heroImage = currentGender === 'women' 
    ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    : 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'

  const categoryParam = searchParams.get('category')
  const categoryTitle = categoryParam ? `${categoryParam} - ${currentGender.charAt(0).toUpperCase() + currentGender.slice(1)}'s Collection` : `${currentGender.charAt(0).toUpperCase() + currentGender.slice(1)}'s Collection`
  const categoryDescription = categoryParam 
    ? `Shop luxury ${categoryParam.toLowerCase()} from KOLZO's ${currentGender}'s collection. Premium quality, designer ${categoryParam.toLowerCase()}, free shipping on orders over ₹16,600.`
    : `Discover KOLZO's luxury ${currentGender}'s collection. Shop designer handbags, premium accessories, luxury makeup, and sophisticated lifestyle products.`

  return (
    <>
      <SEOHead 
        title={`${categoryTitle} - KOLZO Luxury Fashion`}
        description={categoryDescription}
        keywords={`${currentGender}'s fashion, luxury ${currentGender}'s collection, designer ${currentGender}'s accessories, kolzo ${currentGender}, premium ${currentGender}'s fashion, luxury brands`}
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
            alt={`${currentGender}'s luxury collection`}
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
              {currentGender.charAt(0).toUpperCase() + currentGender.slice(1)}'s Collection
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Discover our curated selection of luxury {currentGender}'s items crafted with unparalleled attention to detail.
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
            {filterBy && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-light">
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
                        className="absolute top-4 left-4 p-3 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-gray-800 shadow-lg"
                        whileHover={luxuryAnimations.icon.hover}
                        whileTap={luxuryAnimations.icon.tap}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <div className="text-center relative">
                      <h3 className="text-sm font-light tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-500">
                        {product.name}
                      </h3>
                      <p className="text-lg font-medium mb-2 group-hover:text-gray-800 transition-colors duration-500 relative z-10">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-xs text-gray-500 font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors duration-500">
                        {product.category}
                      </p>
                      <div className="w-8 h-px bg-gray-300 mx-auto opacity-50 group-hover:bg-gray-400 transition-colors duration-500"></div>
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
                  {filterBy 
                    ? `No products in the "${filterBy}" category. Try another category or clear filters.`
                    : "Try adjusting your filter criteria."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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