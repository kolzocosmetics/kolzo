import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductComparisonComponent from '../components/ProductComparison'


interface Product {
  _id?: string
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  gender?: 'men' | 'women' | 'unisex'
  image?: string
  images?: string[]
  variants?: any[]
  tags?: string[]
  status?: 'active' | 'inactive' | 'draft'
  averageRating?: number
  totalReviews?: number
  salesCount?: number
  featured?: boolean
  createdAt?: string
  updatedAt?: string
  size?: string
  specifications?: {
    material?: string
    dimensions?: string
    weight?: string
    care?: string
    warranty?: string
  }
}

const ProductComparisonPage = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const productIds = searchParams.get('products')?.split(',') || []
    loadProducts(productIds)
  }, [searchParams])

  const loadProducts = async (productIds: string[]) => {
    setIsLoading(true)
    try {
      // Mock products data - in real app, this would fetch from API
      const mockProducts: Product[] = [
        {
          id: 'handbag-001',
          name: 'Kolzo Signature Shoulder Bag',
          description: 'Crafted with the finest Italian leather, this signature shoulder bag embodies timeless elegance.',
          price: 265600,
          originalPrice: 295600,
          category: 'Handbags',
          brand: 'Kolzo',
          gender: 'women',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          averageRating: 4.8,
          totalReviews: 156,
          specifications: {
            material: 'Italian Leather',
            dimensions: '12" x 9" x 3"',
            weight: '1.2 lbs',
            care: 'Professional leather care recommended',
            warranty: '2 years'
          }
        },
        {
          id: 'lipstick-001',
          name: 'Kolzo Rouge Velvet Lipstick',
          description: 'A luxurious, long-lasting lipstick with intense color payoff and a velvety finish.',
          price: 650,
          category: 'Makeup',
          brand: 'Kolzo',
          gender: 'women',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80',
          averageRating: 4.6,
          totalReviews: 89,
          specifications: {
            material: 'Natural waxes and oils',
            dimensions: '3.5" x 0.5"',
            weight: '0.1 oz',
            care: 'Store in cool, dry place',
            warranty: '1 year'
          }
        },
        {
          id: 'perfume-001',
          name: 'Kolzo Essence Eau de Parfum',
          description: 'A sophisticated fragrance with notes of jasmine, vanilla, and sandalwood.',
          price: 4200,
          category: 'Fragrances',
          brand: 'Kolzo',
          gender: 'unisex',
          image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2004&q=80',
          averageRating: 4.9,
          totalReviews: 234,
          specifications: {
            material: 'Premium alcohol and essential oils',
            dimensions: '3" x 1" x 1"',
            weight: '1.7 oz',
            care: 'Store away from direct sunlight',
            warranty: '3 years'
          }
        }
      ]

      // Filter products based on IDs from URL
      const filteredProducts = mockProducts.filter(product => 
        productIds.includes(product.id)
      )

      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error loading products for comparison:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    
    // Update URL
    const remainingIds = products.filter(p => p.id !== productId).map(p => p.id)
    const newSearchParams = new URLSearchParams(searchParams)
    if (remainingIds.length > 0) {
      newSearchParams.set('products', remainingIds.join(','))
    } else {
      newSearchParams.delete('products')
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading comparison...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-6">
            Product Comparison
          </h1>
          <p className="text-lg font-light tracking-wide text-gray-600 max-w-2xl mx-auto">
            Compare products side by side to make informed decisions
          </p>
        </motion.div>

        {/* Comparison Component */}
        <ProductComparisonComponent
          products={products}
          onRemoveProduct={handleRemoveProduct}
        />

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
              No Products to Compare
            </h2>
            <p className="text-gray-600 font-light mb-8">
              Add products to your comparison to see them side by side
            </p>
            <a
              href="/"
              className="inline-block bg-black text-white px-8 py-3 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
            >
              Start Shopping
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductComparisonPage 