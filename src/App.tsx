import { Suspense, lazy, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router-dom'

import LuxuryLoadingSpinner from './components/LuxuryLoadingSpinner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SEOHead from './components/SEOHead'
import LiveChat from './components/LiveChat'
import ScrollToTopButton from './components/ScrollToTopButton'
import LuxuryErrorBoundary from './components/LuxuryErrorBoundary'
import { NotificationProvider } from './components/NotificationSystem'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Search = lazy(() => import('./pages/Search'))
const MyOrder = lazy(() => import('./pages/MyOrder'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const AboutKolzo = lazy(() => import('./pages/AboutKolzo'))
const Sustainability = lazy(() => import('./pages/Sustainability'))
const SizeGuide = lazy(() => import('./pages/SizeGuide'))
const CareRepair = lazy(() => import('./pages/CareRepair'))
const FAQs = lazy(() => import('./pages/FAQs'))
const ProductComparisonPage = lazy(() => import('./pages/ProductComparison'))

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
        <Suspense fallback={<LuxuryLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
      <LiveChat />
      <ScrollToTopButton />
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
