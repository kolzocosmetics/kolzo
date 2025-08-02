import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        className="fixed top-0 w-full z-50 supports-backdrop-blur:bg-white/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0)',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 32px rgba(0, 0, 0, 0.1)' : 'none',
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <nav className="w-full px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Fixed width container */}
            <div className="flex items-center justify-start w-1/3 flex-shrink-0">
              {/* Search Icon */}
              <motion.button 
                className="p-2 hover:opacity-70 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
            </div>

            {/* Logo space - will be filled by transitioning hero logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center pointer-events-none">
              {isScrolled && (
                <motion.h1 
                  className="text-xl sm:text-2xl font-light tracking-[0.3em] text-black cursor-pointer whitespace-nowrap pointer-events-auto"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  KOLZO
                </motion.h1>
              )}
            </div>

            {/* Right side - Only mobile menu button */}
            <div className="flex items-center justify-end w-1/3 flex-shrink-0">
              {/* Mobile Menu Button */}
              <motion.button
                className="p-2 transition-all duration-500"
                onClick={() => setIsMobileMenuOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
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
              className="fixed inset-0 bg-black/50 z-60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              transition={{ 
                duration: 0.15,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="fixed inset-0 z-50 md:bg-transparent"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-full bg-white z-70 md:w-96 md:h-screen md:top-0 md:right-0 md:shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween', 
                duration: 0.25,
                ease: "easeOut"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <img src="/src/assets/kolzo_logo.svg" alt="Kolzo" className="h-16 w-auto ml-4 mt-2" />
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Account and Cart Icons */}
                <div className="px-8 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-center space-x-8">
                    {/* Account */}
                    <motion.button 
                      className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Account</span>
                    </motion.button>

                    {/* Wishlist */}
                    <motion.button 
                      className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Wishlist</span>
                    </motion.button>

                    {/* Cart */}
                    <motion.button 
                      className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Cart</span>
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  {navItems.map((item, index) => (
                    <div
                      key={item}
                      className="px-8 py-3"
                    >
                      <Link
                        to={item === 'Women' ? '/collections/women' : item === 'Men' ? '/collections/men' : '#'}
                        className="block text-lg font-light tracking-wide hover:opacity-70 transition-all duration-300"
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
                    <Link to="#" className="block py-2 hover:opacity-70 transition-all duration-300">Contact Us</Link>
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