import { motion } from 'framer-motion'

interface LuxurySkeletonProps {
  type?: 'product' | 'text' | 'image' | 'button'
  className?: string
}

const LuxurySkeleton = ({ type = 'product', className = '' }: LuxurySkeletonProps) => {
  const baseClasses = 'bg-gray-200 animate-pulse'
  
  const variants = {
    product: (
      <div className={`space-y-4 ${className}`}>
        <div className={`aspect-square ${baseClasses} rounded-lg`} />
        <div className="space-y-2">
          <div className={`h-4 ${baseClasses} rounded w-3/4`} />
          <div className={`h-4 ${baseClasses} rounded w-1/2`} />
          <div className={`h-6 ${baseClasses} rounded w-1/3`} />
        </div>
      </div>
    ),
    text: (
      <div className={`space-y-2 ${className}`}>
        <div className={`h-4 ${baseClasses} rounded w-full`} />
        <div className={`h-4 ${baseClasses} rounded w-5/6`} />
        <div className={`h-4 ${baseClasses} rounded w-4/6`} />
      </div>
    ),
    image: (
      <div className={`aspect-square ${baseClasses} rounded-lg ${className}`} />
    ),
    button: (
      <div className={`h-12 ${baseClasses} rounded ${className}`} />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {variants[type]}
    </motion.div>
  )
}

export default LuxurySkeleton 