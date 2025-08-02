import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import productsData from '../data/products.json'

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
  const [selectedTab, setSelectedTab] = useState('details')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    // Find the product by ID from all categories
    const allProducts = [
      ...productsData.featured,
      ...productsData.women,
      ...productsData.men
    ]
    const foundProduct = allProducts.find(p => p.id === id)
    setProduct(foundProduct || null)

    // Get related products from the same category
    if (foundProduct) {
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-[0.1em] mb-4">Product Not Found</h2>
          <Link to="/" className="text-gray-600 hover:text-black transition-all duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Generate multiple images for the product
  const productImages = [
    product.image,
    product.image, // In a real app, these would be different angles
    product.image
  ]

  const variants = {
    colors: ['Black', 'Brown', 'Beige'],
    sizes: ['Small', 'Medium', 'Large']
  }

  const details = `Premium ${product.category.toLowerCase()} crafted with the finest materials. ${product.description} Each piece is handcrafted by master artisans using traditional techniques passed down through generations.`
  const shipping = 'Free shipping on orders over $200. Standard delivery in 3-5 business days. Express shipping available for an additional fee.'
  const returns = '30-day return policy. Items must be in original condition with all tags attached. Return shipping is free for orders over $200.'

  const tabs = [
    { id: 'details', label: 'Details', content: details },
    { id: 'shipping', label: 'Shipping', content: shipping },
    { id: 'returns', label: 'Returns', content: returns }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Model */}
      <motion.section
        className="relative h-[50vh] md:h-[60vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury fashion model"
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
              {product.category}
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Discover the craftsmanship behind each piece
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Breadcrumb */}
        <motion.nav
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-600 font-light tracking-wide">
            <Link to="/" className="hover:text-black transition-all duration-300">Home</Link>
            <span>/</span>
            <Link to="/collections/women" className="hover:text-black transition-all duration-300">Collections</Link>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden group">
                <motion.img 
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  whileHover={{ scale: 1.02 }}
                />
                
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
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="lg:pl-8">
              
              {/* Product Title & Price */}
              <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] mb-6">
                  {product.name}
                </h1>
                <p className="text-2xl font-medium mb-8">${product.price.toLocaleString()}</p>
                <p className="text-gray-600 font-light tracking-wide leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variants */}
              <div className="space-y-8 mb-12">
                {/* Color Selection */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-4">Color</h3>
                  <div className="flex space-x-4">
                    {variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                          selectedColor === color
                            ? 'bg-transparent text-black border-gray-400'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-4">Size</h3>
                  <div className="flex space-x-4">
                    {variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                          selectedSize === size
                            ? 'bg-transparent text-black border-gray-400'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-light tracking-[0.1em] uppercase mb-4">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-light">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-black transition-all duration-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-12">
                <motion.button
                  className="w-full bg-transparent text-black border border-gray-400 py-4 px-8 font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart
                </motion.button>
                
                <button className="w-full border border-gray-300 py-4 px-8 font-light tracking-[0.2em] uppercase hover:border-black transition-all duration-500 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Wishlist
                </button>
              </div>

              {/* Product Tabs */}
              <div>
                <div className="flex border-b border-gray-200 mb-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-6 py-3 text-sm font-light tracking-[0.1em] uppercase transition-all duration-500 ${
                        selectedTab === tab.id
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="text-gray-600 font-light tracking-wide leading-relaxed">
                  {tabs.find(tab => tab.id === selectedTab)?.content}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            className="mt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <h2 className="text-2xl font-light tracking-[0.1em] uppercase mb-12 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5 + (index * 0.1),
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
                      <img 
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
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
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-medium">${relatedProduct.price.toLocaleString()}</p>
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