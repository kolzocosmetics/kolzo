import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import scrollCache from '../utils/scrollCache'
import kolzoLogo from '../assets/kolzo_logo.png'

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
    { name: 'Home', path: '/' },
    { name: 'Women', path: '/collections/women' },
    { name: 'Handbags', path: '/collections/women?category=Handbags' },
    { name: 'Lipstick', path: '/collections/women?category=Lipstick' },
    { name: 'Scarf', path: '/collections/women?category=Scarf' },
    { name: 'Blush', path: '/collections/women?category=Blush' },
    { name: 'Lip Balm', path: '/collections/women?category=Lip Balm' },
    { name: 'Perfumes', path: '/collections/women?category=Perfumes' },
    { name: 'Eye Liner', path: '/collections/women?category=Eye Liner' },
    { name: 'Compact', path: '/collections/women?category=Compact' },
    { name: 'Watches', path: '/collections/women?category=Watches' },
    { name: 'Men', path: '/collections/men' },
    { name: 'Wallet', path: '/collections/men?category=Wallet' },
    { name: 'Bracelets', path: '/collections/men?category=Bracelets' },
    { name: 'Perfumes', path: '/collections/men?category=Perfumes' },
    { name: 'Handbags', path: '/collections/men?category=Handbags' },
    { name: 'Watches', path: '/collections/men?category=Watches' },
    { name: 'Moisturiser', path: '/collections/men?category=Moisturiser' },
    { name: 'Face Wash', path: '/collections/men?category=Face Wash' },
    { name: 'Sunscreen', path: '/collections/men?category=Sunscreen' },
    { name: 'Shaving Kit', path: '/collections/men?category=Shaving Kit' }
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
                         {/* Left side - Search only */}
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
                onClick={() => {
                  // Clear homepage scroll cache when navigating from other pages
                  if (window.location.pathname !== '/') {
                    scrollCache.clearPageCache('/')
                  }
                  navigate('/')
                }}
              >
                KOLZO
              </motion.h1>
            </div>

                         {/* Right side - Instagram and Menu */}
             <div className="flex items-center justify-end w-1/3 flex-shrink-0 space-x-2">
               {/* Instagram Icon */}
               <motion.button 
                 className="p-2 hover:opacity-70 transition-all duration-700 text-gray-700 hover:text-black group"
                 whileHover={{ 
                   scale: 1.1,
                   rotate: 5,
                   transition: { duration: 0.3 }
                 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => window.open('https://instagram.com/kolzo', '_blank')}
               >
                 <motion.div
                   className="relative"
                   whileHover={{ rotate: 360 }}
                   transition={{ duration: 0.6, ease: "easeInOut" }}
                 >
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                   </svg>
                   <motion.div
                     className="absolute inset-0 bg-black/5 rounded-full"
                     initial={{ scale: 0 }}
                     whileHover={{ scale: 1.5 }}
                     transition={{ duration: 0.3 }}
                   />
                 </motion.div>
               </motion.button>

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
              className="fixed top-0 right-0 w-full h-full bg-white/95 backdrop-blur-xl z-70 md:w-80 md:h-screen md:top-0 md:right-0 md:shadow-2xl border-l border-white/30 max-w-sm"
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
                  <div className="flex items-center">
                    <img 
                      src={kolzoLogo} 
                      alt="Kolzo" 
                      className="h-16 w-auto ml-4 mt-2" 
                      onError={(e) => {
                        console.error('Logo failed to load:', e);
                        console.log('Logo src:', kolzoLogo);
                      }}
                      onLoad={() => console.log('Logo loaded successfully:', kolzoLogo)}
                    />
                    <span className="ml-2 text-sm text-gray-500">Kolzo</span>
                  </div>
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

                {/* Quick Actions */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-center space-x-6">
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Search</span>
                    </motion.button>

                    {/* Cart */}
                    <motion.button 
                      className="flex flex-col items-center space-y-1 text-gray-700 hover:text-black transition-all duration-300"
                      onClick={() => {
                        navigate('/cart')
                        setIsMobileMenuOpen(false)
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span className="text-xs font-light tracking-wide">Cart</span>
                    </motion.button>
                  </div>
                </div>

                                 {/* Mobile Menu Items */}
                 <div className="flex-1 overflow-y-auto py-4">
                   {navItems.map((item) => (
                     <div key={item.name}>
                       {/* Separator before Men */}
                       {item.name === 'Men' && (
                         <div className="px-6 py-2">
                           <div className="border-t border-gray-200"></div>
                         </div>
                       )}
                       
                       <div className="px-6 py-3">
                         <Link
                           to={item.path}
                           className={`flex items-center space-x-3 font-light tracking-wide hover:text-black transition-all duration-300 text-gray-700 ${
                             item.name === 'Home' || item.name === 'Women' || item.name === 'Men'
                               ? 'text-base font-medium'
                               : 'text-sm pl-8'
                           }`}
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           {/* Icon based on menu item */}
                           <div className="w-5 h-5 flex-shrink-0">
                             {item.name === 'Home' && (
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                               </svg>
                             )}
                             {item.name === 'Women' && (
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                               </svg>
                             )}
                             {item.name === 'Men' && (
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                               </svg>
                             )}
                             {/* Category icons */}
                             {(item.name === 'Handbags' || item.name === 'Lipstick' || item.name === 'Scarf' || 
                               item.name === 'Blush' || item.name === 'Lip Balm' || item.name === 'Perfumes' || 
                               item.name === 'Eye Liner' || item.name === 'Compact' || item.name === 'Watches' ||
                               item.name === 'Wallet' || item.name === 'Bracelets' || item.name === 'Moisturiser' ||
                               item.name === 'Face Wash' || item.name === 'Sunscreen' || item.name === 'Shaving Kit') && (
                               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                               </svg>
                             )}
                           </div>
                           <span>{item.name}</span>
                         </Link>
                       </div>
                     </div>
                   ))}
                 </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 font-light text-center">
                    <p>© 2024 Kolzo. All rights reserved.</p>
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