import { motion } from 'framer-motion'

interface LuxurySkeletonProps {
  type?: 'product-card' | 'product-detail' | 'category-grid'
  count?: number
}

const LuxurySkeleton = ({ type = 'product-card', count = 1 }: LuxurySkeletonProps) => {
  const shimmerAnimation = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite'
  }

  const ProductCardSkeleton = () => (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-100 mb-6 overflow-hidden relative">
          <motion.div
            className="w-full h-full"
            style={shimmerAnimation}
            animate={{ 
              backgroundPosition: ['200% 0', '-200% 0']
            }}
            transition={{ 
              duration: 2, 
              ease: "linear", 
              repeat: Infinity 
            }}
          />
        </div>
        
        {/* Wishlist button skeleton */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full shadow-md" />
      </div>
      
      {/* Text skeletons */}
      <div className="text-center space-y-3">
        <div className="h-4 bg-gray-100 mx-auto w-3/4" style={shimmerAnimation} />
        <div className="h-4 bg-gray-100 mx-auto w-1/2" style={shimmerAnimation} />
        <div className="h-6 bg-gray-100 mx-auto w-1/3" style={shimmerAnimation} />
      </div>
    </motion.div>
  )

  const ProductDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Gallery skeleton */}
      <div className="space-y-8">
        <div className="aspect-square bg-gray-100" style={shimmerAnimation} />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-gray-100" style={shimmerAnimation} />
          ))}
        </div>
      </div>
      
      {/* Info skeleton */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 w-3/4" style={shimmerAnimation} />
          <div className="h-6 bg-gray-100 w-1/2" style={shimmerAnimation} />
          <div className="h-12 bg-gray-100 w-full" style={shimmerAnimation} />
        </div>
        
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 w-1/3" style={shimmerAnimation} />
          <div className="h-6 bg-gray-100 w-1/2" style={shimmerAnimation} />
        </div>
        
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 w-full" style={shimmerAnimation} />
          <div className="h-12 bg-gray-100 w-full" style={shimmerAnimation} />
        </div>
      </div>
    </div>
  )

  const CategoryGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'product-detail':
        return <ProductDetailSkeleton />
      case 'category-grid':
        return <CategoryGridSkeleton />
      default:
        return Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
    }
  }

  return (
    <div className="w-full">
      {renderSkeleton()}
    </div>
  )
}

export default LuxurySkeleton 