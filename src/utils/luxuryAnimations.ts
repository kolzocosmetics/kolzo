import { easeInOut } from 'framer-motion'

// Luxury animation system for Kolzo - inspired by high-end fashion brands
export const luxuryAnimations = {
  // Smooth hover animations for product cards
  productCard: {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -8,
      transition: {
        duration: 0.6,
        ease: easeInOut
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  },

  // Elegant button hover animations
  button: {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -2,
      transition: {
        duration: 0.4,
        ease: easeInOut
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  },

  // Icon hover animations
  icon: {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: easeInOut
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: easeInOut
      }
    }
  },

  // Image hover animations
  image: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.08,
      transition: {
        duration: 0.8,
        ease: easeInOut
      }
    }
  },

  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeInOut
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: {
        duration: 0.3,
        ease: easeInOut
      }
    }
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeInOut
      }
    },
    exit: { 
      opacity: 0, 
      y: -30,
      transition: {
        duration: 0.5,
        ease: easeInOut
      }
    }
  },

  // Stagger animations for lists
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: easeInOut
        }
      }
    }
  },

  // Luxury easing curve
  easing: easeInOut,

  // Common transition durations
  durations: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    luxury: 0.8
  }
}

// Utility functions for common animations
export const luxuryHover = {
  scale: 1.02,
  y: -4,
  transition: {
    duration: 0.5,
    ease: easeInOut
  }
}

export const luxuryTap = {
  scale: 0.98,
  transition: {
    duration: 0.2,
    ease: easeInOut
  }
}

export const luxuryImageHover = {
  scale: 1.06,
  transition: {
    duration: 0.7,
    ease: easeInOut
  }
} 