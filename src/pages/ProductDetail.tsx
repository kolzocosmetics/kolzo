import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import productsData from '../data/products.json'
import productsFData from '../data/products-f.json'
import productsMData from '../data/products-m.json'
import LuxuryLoadingSpinner from '../components/LuxuryLoadingSpinner'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { luxuryAnimations } from '../utils/luxuryAnimations'
import { trackWishlistAdd, trackWishlistRemove } from '../utils/analytics'
import SEOHead from '../components/SEOHead'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [selectedTab, setSelectedTab] = useState('details')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>([])
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    
    // Combine all product data from different files
    const allProducts: Product[] = []
    
    // Add products from main products.json
    if (productsData.featured) allProducts.push(...productsData.featured)
    if (productsData.women) allProducts.push(...productsData.women)
    if (productsData.men) allProducts.push(...productsData.men)
    
    // Add products from products-f.json
    Object.values(productsFData).forEach(category => {
      if (Array.isArray(category)) {
        allProducts.push(...category)
      }
    })
    
    // Add products from products-m.json
    Object.values(productsMData).forEach(category => {
      if (Array.isArray(category)) {
        allProducts.push(...category)
      }
    })
    
    // Find the product by ID
    const foundProduct = allProducts.find(p => p.id === id)
    setProduct(foundProduct || null)

    // Get related products using recommendation engine
    if (foundProduct) {
      const categoryProducts = allProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
      setAllCategoryProducts(categoryProducts)
      
      // Recommendation engine: prioritize by price range, then randomize
      const priceRange = foundProduct.price * 0.3 // 30% price range
      const minPrice = foundProduct.price - priceRange
      const maxPrice = foundProduct.price + priceRange
      
      // Get products in similar price range first
      const similarPriceProducts = categoryProducts.filter(p => 
        p.price >= minPrice && p.price <= maxPrice
      )
      
      // Get remaining products
      const otherProducts = categoryProducts.filter(p => 
        p.price < minPrice || p.price > maxPrice
      )
      
      // Combine and shuffle for variety
      const recommendedProducts = [
        ...similarPriceProducts.sort(() => Math.random() - 0.5),
        ...otherProducts.sort(() => Math.random() - 0.5)
      ].slice(0, 4)
      
      setRelatedProducts(recommendedProducts)
    }
    
    setIsLoading(false)
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return <LuxuryLoadingSpinner size="large" text="Loading Product..." />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-[0.1em] mb-4">Product Not Found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-black transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Generate multiple images for the product (Gucci-style)
  const productImages = [
    product.image,
    product.image, // In a real app, these would be different angles
    product.image
  ]

  const handleAddToCart = () => {
    if (!product) return
    
    console.log('Add to cart clicked!', product.name)
    setIsAddingToCart(true)
    
    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor
    })
    
    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false)
      // Show success message
      alert(`${product.name} added to cart!`) // Simple feedback for now
    }, 1000)
  }

  const variants = {
    colors: ['Black', 'Brown', 'Beige', 'Red'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }

  const details = `Crafted with the finest materials and attention to detail, this ${product.category.toLowerCase()} embodies the essence of luxury. Each piece is meticulously handcrafted by master artisans using traditional techniques passed down through generations. The premium ${product.category.toLowerCase()} features exquisite detailing and superior craftsmanship that ensures both beauty and durability.`
  
  const shipping = 'Complimentary shipping on all orders. Standard delivery in 3-5 business days. Express shipping available for an additional fee. International shipping available to select countries.'
  
  const returns = '30-day return policy for unworn items in original condition with all tags attached. Return shipping is complimentary for orders over $500. Exchanges available for different sizes or colors.'

  const tabs = [
    { id: 'details', label: 'Details', content: details },
    { id: 'shipping', label: 'Shipping', content: shipping },
    { id: 'returns', label: 'Returns', content: returns }
  ]

  return (
    <>
      {product && (
        <SEOHead 
          title={`${product.name} - KOLZO Luxury Fashion`}
          description={`Shop ${product.name} from KOLZO's luxury collection. ${product.description}. Premium quality, free shipping on orders over $200.`}
          keywords={`${product.name}, ${product.category}, luxury fashion, kolzo, designer ${product.category.toLowerCase()}, premium accessories`}
          image={product.image}
          type="product"
          productData={{
            name: product.name,
            price: product.price,
            currency: "USD",
            availability: "InStock",
            brand: "KOLZO",
            category: product.category,
            images: productImages
          }}
        />
      )}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Breadcrumb */}
        <motion.nav
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4 text-sm text-gray-600 font-light tracking-wide">
            <Link to="/" className="hover:text-black transition-all duration-300">Home</Link>
            <span>/</span>
            <Link to="/collections/women" className="hover:text-black transition-all duration-300">Collections</Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="space-y-8">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden group relative">
                <motion.img 
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  loading="eager"
                  whileHover={{ scale: 1.02 }}
                />
                
                {/* Wishlist button */}
                <motion.button 
                  className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </motion.button>

                {/* Zoom indicator */}
                <div className="absolute bottom-6 left-6 bg-black/80 text-white px-3 py-1 text-xs font-light tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Hover to zoom
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-6">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-50 cursor-pointer hover:opacity-80 transition-all duration-500 overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="lg:pl-12">
              
              {/* Product Title & Price */}
              <div className="mb-16">
                <h1 className="text-heading font-display font-light tracking-[0.15em] mb-8 leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-light tracking-[0.2em] mb-12">${product.price.toLocaleString()}</p>
                <p className="text-gray-600 font-light tracking-wide leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Variants */}
              <div className="space-y-12 mb-16">
                {/* Color Selection */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-6">Color</h3>
                  <div className="flex flex-wrap gap-4">
                    {variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-8 py-4 text-sm font-light tracking-[0.15em] border-2 transition-all duration-500 ${
                          selectedColor === color
                            ? 'bg-black text-white border-black shadow-lg'
                            : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selectedColor === color ? '#000000' : '#FFFFFF',
                          color: selectedColor === color ? '#FFFFFF' : '#000000',
                          borderColor: selectedColor === color ? '#000000' : '#D1D5DB'
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-6">Size</h3>
                  <div className="flex flex-wrap gap-4">
                    {variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-8 py-4 text-sm font-light tracking-[0.15em] border-2 transition-all duration-500 ${
                          selectedSize === size
                            ? 'bg-black text-white border-black shadow-lg'
                            : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selectedSize === size ? '#000000' : '#FFFFFF',
                          color: selectedSize === size ? '#FFFFFF' : '#000000',
                          borderColor: selectedSize === size ? '#000000' : '#D1D5DB'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.2em] uppercase mb-6">Quantity</h3>
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500 text-lg"
                    >
                      -
                    </button>
                    <span className="w-20 text-center font-light text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6 mb-16 relative z-10">
                
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full py-6 px-8 font-light tracking-[0.3em] uppercase text-lg transition-all duration-500 shadow-lg relative z-20 !important ${
                    isAddingToCart 
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                      : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl border-2 border-black'
                  }`}
                  whileHover={isAddingToCart ? {} : luxuryAnimations.button.hover}
                  whileTap={isAddingToCart ? {} : luxuryAnimations.button.tap}
                  animate={!isAddingToCart ? { 
                    boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 20px 25px -5px rgba(0, 0, 0, 0.1)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ 
                    position: 'relative',
                    zIndex: 20,
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1,
                    backgroundColor: isAddingToCart ? '#9CA3AF' : '#000000',
                    color: '#FFFFFF',
                    border: '2px solid #000000'
                  }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                    </svg>
                    <span>{isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}</span>
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={() => {
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
                  className={`w-full border-2 py-6 px-8 font-light tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center text-lg shadow-lg ${
                    isInWishlist(product.id)
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-black hover:bg-black hover:text-white'
                  }`}
                  whileHover={luxuryAnimations.button.hover}
                  whileTap={luxuryAnimations.button.tap}
                  style={{
                    backgroundColor: isInWishlist(product.id) ? '#FEF2F2' : '#FFFFFF',
                    color: isInWishlist(product.id) ? '#DC2626' : '#000000',
                    borderColor: isInWishlist(product.id) ? '#EF4444' : '#000000'
                  }}
                >
                  <svg className={`w-6 h-6 mr-4 ${isInWishlist(product.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </motion.button>
              </div>

              {/* Product Tabs */}
              <div>
                <div className="flex border-b-2 border-gray-200 mb-12">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-8 py-4 text-sm font-light tracking-[0.2em] uppercase transition-all duration-500 border-b-2 ${
                        selectedTab === tab.id
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-600 hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="text-gray-600 font-light tracking-wide leading-relaxed text-lg">
                  {tabs.find(tab => tab.id === selectedTab)?.content}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            className="mt-32"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-20">
              <div className="text-center sm:text-left mb-6 sm:mb-0">
                <h2 className="text-4xl sm:text-5xl font-light tracking-[0.3em] uppercase mb-4 text-gray-900">
                  You May Also Like
                </h2>
                <p className="text-sm font-light tracking-[0.2em] uppercase text-gray-600 max-w-md">
                  Discover more curated pieces from our collection
                </p>
              </div>
              {allCategoryProducts.length > 4 && (
                <motion.button
                  onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                  className="text-xs font-light tracking-[0.3em] uppercase border-b border-gray-400 hover:border-black transition-all duration-500 self-start sm:self-auto hidden sm:block px-0 pb-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showAllRecommendations ? 'Show Less' : `View All (${allCategoryProducts.length} items)`}
                </motion.button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + (index * 0.1) }}
                >
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative" style={{ backgroundColor: '#f9fafb' }}>
                      <img 
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          console.error('Image failed to load:', relatedProduct.image);
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', relatedProduct.image);
                        }}
                        style={{
                          minHeight: '100%',
                          minWidth: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      
                      {/* Wishlist button */}
                      <motion.button 
                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-sm font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors duration-500">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-light tracking-[0.1em]">${relatedProduct.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile View All Button */}
            {allCategoryProducts.length > 4 && (
              <div className="flex justify-center mt-12 mb-12 sm:hidden">
                <motion.button
                  onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                  className="text-xs font-light tracking-[0.3em] uppercase border-b border-gray-400 hover:border-black transition-all duration-500 px-0 pb-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showAllRecommendations ? 'Show Less' : `View All (${allCategoryProducts.length} items)`}
                </motion.button>
              </div>
            )}
            
            {/* Expanded Recommendations Section */}
            {showAllRecommendations && allCategoryProducts.length > 4 && (
              <motion.div
                className="mt-16"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="border-t border-gray-200 pt-20">
                  <div className="text-center mb-16">
                    <h3 className="text-3xl sm:text-4xl font-light tracking-[0.3em] uppercase mb-4 text-gray-900">
                      Curated Recommendations
                    </h3>
                    <p className="text-sm font-light tracking-[0.2em] uppercase text-gray-600 max-w-lg mx-auto">
                      Handpicked selections for your refined taste
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {allCategoryProducts
                      .filter(p => !relatedProducts.find(rp => rp.id === p.id)) // Exclude already shown products
                      .map((recommendedProduct, index) => (
                        <motion.div
                          key={recommendedProduct.id}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.1 + (index * 0.05) }}
                        >
                          <Link to={`/product/${recommendedProduct.id}`}>
                            <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative" style={{ backgroundColor: '#f9fafb' }}>
                              <img 
                                src={recommendedProduct.image}
                                alt={recommendedProduct.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  console.error('Image failed to load:', recommendedProduct.image);
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80';
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', recommendedProduct.image);
                                }}
                                style={{
                                  minHeight: '100%',
                                  minWidth: '100%',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                              
                              {/* Wishlist button */}
                              <motion.button 
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                              </motion.button>
                            </div>
                            
                            <div className="text-center">
                              <h3 className="text-sm font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors duration-500">
                                {recommendedProduct.name}
                              </h3>
                              <p className="text-lg font-light tracking-[0.1em]">${recommendedProduct.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
        )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail