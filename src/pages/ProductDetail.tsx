import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import productsData from '../data/products.json'
import productsFData from '../data/products-f.json'
import productsMData from '../data/products-m.json'

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
  const [selectedTab, setSelectedTab] = useState('details')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    // Get related products from the same category
    if (foundProduct) {
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
    
    setIsLoading(false)
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-light tracking-wide">Loading...</p>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-white">
      {/* Luxury Hero Section */}
      <motion.section
        className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <motion.div
            className="text-center px-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] uppercase mb-6">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Discover the artistry behind each meticulously crafted piece
            </p>
            <div className="mt-8">
              <span className="text-3xl font-light tracking-[0.2em]">
                ${product.price.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

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
                <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] mb-8 leading-tight">
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
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
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
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-gray-300 hover:border-black'
                        }`}
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
              <div className="space-y-6 mb-16">
                <motion.button
                  className="w-full bg-black text-white py-6 px-8 font-light tracking-[0.3em] uppercase hover:bg-gray-800 transition-all duration-500 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart
                </motion.button>
                
                <button className="w-full border-2 border-black py-6 px-8 font-light tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500 flex items-center justify-center text-lg">
                  <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  Add to Wishlist
                </button>
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
            <h2 className="text-3xl font-light tracking-[0.2em] uppercase mb-16 text-center">
              You May Also Like
            </h2>
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
                    <div className="aspect-square bg-gray-50 mb-6 overflow-hidden relative">
                      <img 
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500" />
                      
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
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail