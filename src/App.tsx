import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import scrollCache from './utils/scrollCache'
import { NotificationProvider } from './components/NotificationSystem'

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Search = lazy(() => import('./pages/Search'))
const MyOrder = lazy(() => import('./pages/MyOrder'))
const FAQs = lazy(() => import('./pages/FAQs'))
const AboutKolzo = lazy(() => import('./pages/AboutKolzo'))
const Sustainability = lazy(() => import('./pages/Sustainability'))
const SizeGuide = lazy(() => import('./pages/SizeGuide'))
const CareRepair = lazy(() => import('./pages/CareRepair'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))

import LuxuryLoadingSpinner from './components/LuxuryLoadingSpinner'

// Loading component
const LoadingSpinner = () => (
  <LuxuryLoadingSpinner size="large" text="Loading Kolzo..." />
)

// Scroll position manager component
const ScrollManager = () => {
  const location = useLocation()

  useEffect(() => {
    // Update current path and restore scroll position
    scrollCache.setCurrentPath(location.pathname)
    scrollCache.restoreScrollPosition(location.pathname)
    
    // Track page view for analytics
    try {
      import('./utils/analytics').then(({ trackPageView }) => {
        trackPageView(location.pathname)
      }).catch(() => {
        // Silently fail if analytics module is not available
        console.log('Analytics module not available')
      })
    } catch (error) {
      // Silently fail if analytics fails to load
      console.log('Analytics error:', error)
    }
  }, [location.pathname])

  return null
}

// 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-light tracking-[0.2em] uppercase mb-6">404</h1>
        <p className="text-xl font-light tracking-wide mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block bg-transparent text-black border border-gray-400 px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-500"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <ScrollManager />
        <div className="min-h-screen w-full bg-white text-black">
          <Navbar />
          <main className="w-full">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/women" element={<CategoryPage gender="women" />} />
                <Route path="/collections/men" element={<CategoryPage gender="men" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/my-order" element={<MyOrder />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/about-kolzo" element={<AboutKolzo />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/care-repair" element={<CareRepair />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                
                {/* 404 Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </NotificationProvider>
  )
}

export default App
