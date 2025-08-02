import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const [selectedTab, setSelectedTab] = useState('details')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedImage, setSelectedImage] = useState(0)

  // Placeholder product data - in real app would fetch based on id
  const product = {
    id: id || 'sample-001',
    name: 'Kolzo Signature Shoulder Bag',
    price: 3200,
    description: 'Crafted with the finest Italian leather, this signature shoulder bag embodies timeless elegance. Each piece is handcrafted by master artisans using traditional techniques passed down through generations.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ],
    variants: {
      colors: ['Black', 'Brown', 'Beige'],
      sizes: ['Small', 'Medium', 'Large']
    },
    details: 'Premium Italian leather with hand-stitched details. Features a removable shoulder strap, interior zip pocket, and protective feet. Dimensions: 30cm x 20cm x 10cm.',
    shipping: 'Free shipping on orders over $200. Standard delivery in 3-5 business days. Express shipping available for an additional fee.',
    returns: '30-day return policy. Items must be in original condition with all tags attached. Return shipping is free for orders over $200.'
  }

  const tabs = [
    { id: 'details', label: 'Details', content: product.details },
    { id: 'shipping', label: 'Shipping', content: product.shipping },
    { id: 'returns', label: 'Returns', content: product.returns }
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
              Product Details
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
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img 
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
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
                    {product.variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                          selectedColor === color
                            ? 'bg-black text-white border-black'
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
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 text-sm font-light tracking-wide border transition-all duration-500 ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
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
                  className="w-full bg-black text-white py-4 px-8 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
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
      </div>
    </div>
  )
}

export default ProductDetail