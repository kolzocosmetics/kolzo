import { motion } from 'framer-motion'

interface LuxuryLoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const LuxuryLoadingSpinner = ({ size = 'medium', text = 'Loading...' }: LuxuryLoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className={`${sizeClasses[size]} mx-auto mb-6 relative`}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
          
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 border-2 border-transparent border-t-black rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity 
            }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute inset-2 bg-black rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity 
            }}
          />
        </motion.div>
        
        <motion.p
          className="text-sm font-light tracking-wide text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        >
          {text}
        </motion.p>
      </div>
    </div>
  )
}

export default LuxuryLoadingSpinner 