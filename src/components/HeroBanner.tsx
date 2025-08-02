import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'

const HeroBanner = () => {
  const ref = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  // Get scroll progress for navbar transition
  const { scrollYProgress: navbarScroll } = useScroll({
    offset: ["start start", "end start"]
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Stationary background with subtle overlay effect
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0.3])

  // Logo animation - starts large and moves to navbar
  const logoScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.08])
  const logoY = useTransform(scrollYProgress, [0, 0.4], [0, -800])
  const logoOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 1])

  return (
    <section ref={ref} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white" style={{ overflowX: 'hidden' }}>
      {/* Background Image - Beautiful luxury model */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/model.webp)'
        }}
      />
      
      {/* Elegant overlay */}
      <motion.div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Large KOLZO Logo - Moved to Top */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20"
        style={{
          scale: logoScale,
          y: logoY,
          position: 'fixed',
          top: isScrolled ? '20px' : '80px',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: isScrolled ? 'translateY(-20px) scale(0.9)' : 'translateY(0) scale(1)',
          opacity: isScrolled ? 0.7 : 1
        }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] cursor-pointer text-center whitespace-nowrap"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: isScrolled ? '#000000' : '#ffffff'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          whileHover={{ opacity: 0.8 }}
        >
          KOLZO
        </motion.h1>
      </motion.div>
      
      {/* Main Content - Positioned lower and moves up on scroll */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 z-10 text-center text-white px-6 w-full max-w-6xl"
        style={{
          bottom: isScrolled ? '32px' : '120px',
          transition: 'bottom 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1.2, 
          delay: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="space-y-8">
          {/* Product Category */}
          <motion.h2
            className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            Handbags
          </motion.h2>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Link
              to="/collections/women"
              className="inline-block bg-white text-black px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500 border border-white hover:shadow-lg"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </motion.div>
      

    </section>
  )
}

export default HeroBanner