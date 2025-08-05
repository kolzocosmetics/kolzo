import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEOHead from './components/SEOHead'
import LiveChat from './components/LiveChat'
import ScrollToTopButton from './components/ScrollToTopButton'
import LuxuryErrorBoundary from './components/LuxuryErrorBoundary'
import { NotificationProvider } from './components/NotificationSystem'
import NewsletterTrigger from './components/NewsletterTrigger'
import LuxuryChatbot from './components/LuxuryChatbot'

// Import all pages directly (no lazy loading)
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Search from './pages/Search'
import MyOrder from './pages/MyOrder'
import OrderSuccess from './pages/OrderSuccess'
import AboutKolzo from './pages/AboutKolzo'
import Sustainability from './pages/Sustainability'
import SizeGuide from './pages/SizeGuide'
import CareRepair from './pages/CareRepair'
import FAQs from './pages/FAQs'
import ProductComparisonPage from './pages/ProductComparison'
import BrevoTestPage from './pages/BrevoTestPage'

// Backend initializer component
const BackendInitializer = () => {
  useEffect(() => {
    // Initialize backend connection and data fetching
    console.log('Backend initialized')
  }, [])
  return null
}

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category/:gender", element: <CategoryPage /> },
      { path: "/collections/:gender", element: <CategoryPage /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/search", element: <Search /> },
      { path: "/my-order", element: <MyOrder /> },
      { path: "/order-success", element: <OrderSuccess /> },
      { path: "/about-kolzo", element: <AboutKolzo /> },
      { path: "/sustainability", element: <Sustainability /> },
      { path: "/size-guide", element: <SizeGuide /> },
      { path: "/care-repair", element: <CareRepair /> },
      { path: "/faqs", element: <FAQs /> },
      { path: "/product-comparison", element: <ProductComparisonPage /> },
      { path: "/brevo-test", element: <BrevoTestPage /> },
    ],
  },
])

// App Layout Component
function AppLayout() {
  return (
    <div className="App">
      <SEOHead />
      <ScrollToTop />
      <BackendInitializer />
      
      <Navbar />
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
      <LiveChat />
      <ScrollToTopButton />
      
      {/* Newsletter Triggers */}
      <NewsletterTrigger 
        triggerType="exit-intent" 
        source="homepage" 
        showOnce={true}
      />
      <NewsletterTrigger 
        triggerType="scroll" 
        scrollPercentage={80} // Only show after 80% scroll
        source="homepage" 
        showOnce={true}
      />

      {/* Luxury Chatbot */}
      <LuxuryChatbot />
    </div>
  )
}

function App() {
  return (
    <NotificationProvider>
      <LuxuryErrorBoundary>
        <RouterProvider router={router} />
      </LuxuryErrorBoundary>
    </NotificationProvider>
  )
}

export default App
