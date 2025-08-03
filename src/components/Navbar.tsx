import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      
      // Lock scroll on both body and html
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      
      // Also lock html element
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Restore scroll
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Use framer-motion's scroll utilities for smooth transitions
  const { scrollY } = useScroll()
  
  // Create sophisticated transforms based on scroll position
  const navbarOpacity = useTransform(scrollY, [0, 150], [0, 0.8])
  
  // For logo visibility - show when scrolled past 80px
  const logoOpacity = useTransform(scrollY, [100, 150], [0, 1])
  const logoScale = useTransform(scrollY, [100, 150], [0.8, 1])
  
  // For background gradient intensity
  const gradientOpacity = useTransform(scrollY, [0, 150], [0, 0.8])

  const navItems = [
    'New In',
    'Women', 
    'Men',
    'Handbags',
    'Fragrances & Makeup',
    'Jewelry & Watches',
    'Décor & Lifestyle',
    'Gifts',
    'Kolzo Services',
    'Store Locator'
  ]

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: "transparent",
          backdropFilter: "none",
          borderBottom: "none",
          boxShadow: "none",
        }}
      >
        {/* Glassmorphism Background Layer */}
        <motion.div
          style={{
            opacity: navbarOpacity,
          }}
          className="absolute inset-0 bg-slate-50/80 backdrop-blur-md border-b-2 border-slate-200/80 shadow-lg"
        />
        
        {/* Subtle Gradient Overlay */}
        <motion.div
          style={{
            opacity: gradientOpacity,
          }}
          className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"
        />

        <nav className="w-full px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Fixed width container */}
            <div className="flex items-center justify-start w-1/3 flex-shrink-0">
              {/* Search Icon with sophisticated animation - ALWAYS VISIBLE */}
              <motion.button 
                className="p-2 hover:opacity-70 transition-all duration-700 text-gray-700 hover:text-black group"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
              >
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <motion.div
                    className="absolute inset-0 bg-black/5 rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.button>
            </div>

            {/* Logo space - will be filled by transitioning hero logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
              <motion.h1 
                className="text-xl sm:text-2xl font-light tracking-[0.3em] text-gray-800 cursor-pointer whitespace-nowrap pointer-events-auto"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  opacity: logoOpacity,
                  scale: logoScale,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  textShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: { duration: 0.3 }
                }}
              >
                KOLZO
              </motion.h1>
            </div>

            {/* Right side - Only mobile menu button */}
            <div className="flex items-center justify-end w-1/3 flex-shrink-0">
              {/* Mobile Menu Button with sophisticated animation - ALWAYS VISIBLE */}
              <motion.button
                className="p-2 transition-all duration-700 text-gray-700 hover:text-black group"
                onClick={() => setIsMobileMenuOpen(true)}
                whileHover={{ 
                  scale: 1.1,
                  rotate: -5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <motion.div
                    className="absolute inset-0 bg-black/5 rounded-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-60 md:hidden backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="fixed inset-0 z-50 md:bg-transparent"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-full bg-white/95 backdrop-blur-xl z-70 md:w-96 md:h-screen md:top-0 md:right-0 md:shadow-2xl border-l border-white/30"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                duration: 0.6,
                damping: 25,
                stiffness: 200
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <img src="/src/assets/kolzo_logo.svg" alt="Kolzo" className="h-16 w-auto ml-4 mt-2" />
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 text-gray-700"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Account and Cart Icons */}
                <div className="px-6 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-center space-x-1">
                    {/* Search */}
                    <motion.button 
                      className="flex flex-col items-center space-y-1 text-gray-700 hover:text-black transition-all duration-300"
                      onClick={() => {
                        navigate('/search')
                        setIsMobileMenuOpen(false)
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Search</span>
                    </motion.button>

                    {/* Account */}
                    <motion.button 
                      className="flex flex-col items-center space-y-1 text-gray-700 hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Account</span>
                    </motion.button>

                    {/* Wishlist */}
                    <motion.button 
                      className="flex flex-col items-center space-y-1 text-gray-700 hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Wishlist</span>
                    </motion.button>

                    {/* Cart */}
                    <motion.button 
                      className="flex flex-col items-center space-y-1 text-gray-700 hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Cart</span>
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  {navItems.map((item) => (
                    <div
                      key={item}
                      className="px-8 py-3"
                    >
                      <Link
                        to={item === 'Women' ? '/collections/women' : item === 'Men' ? '/collections/men' : '#'}
                        className="block text-lg font-light tracking-wide hover:text-black transition-all duration-300 text-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 font-light">
                    <Link to="#" className="block py-2 hover:text-black transition-all duration-300">Contact Us</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar