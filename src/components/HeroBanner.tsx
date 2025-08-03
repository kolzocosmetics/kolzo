import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import modelWebp from '../assets/homepage/model.webp'

const HeroBanner = () => {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  // Logo animation - starts large and moves to navbar
  const logoScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.25])
  const logoY = useTransform(scrollYProgress, [0, 0.4], [0, -400])
  const logoOpacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0])

  return (
    <section ref={ref} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background Image - Completely static */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={modelWebp}
          alt="Luxury model background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block'
          }}
        />
      </div>
      
      {/* Static overlay */}
      <div className="absolute inset-0 bg-black opacity-20" />

      {/* Large KOLZO Logo - Animated positioning */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 z-20"
        style={{
          scale: logoScale,
          y: logoY,
          opacity: logoOpacity
        }}
      >
        <h1 
          className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] cursor-pointer text-center whitespace-nowrap text-white"
          style={{ 
            fontFamily: 'Playfair Display, serif'
          }}
        >
          KOLZO
        </h1>
      </motion.div>
      
      {/* Main Content - Animated positioning */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10 text-center text-white px-6 w-full max-w-6xl"
        style={{
          bottom: useTransform(scrollYProgress, [0, 0.4], ['120px', '32px'])
        }}
      >
        <div className="space-y-8">
          {/* Product Category */}
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase text-white">
            Handbags
          </h2>
          
          {/* CTA Button */}
          <div>
            <Link
              to="/collections/women?category=Handbags"
              className="inline-block bg-white text-black px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500 border border-white hover:shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroBanner