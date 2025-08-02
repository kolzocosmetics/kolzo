import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Search from './pages/Search'

import MyOrder from './pages/MyOrder'
import FAQs from './pages/FAQs'
import AboutKolzo from './pages/AboutKolzo'
import Sustainability from './pages/Sustainability'
import SizeGuide from './pages/SizeGuide'
import CareRepair from './pages/CareRepair'

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
    <Router>
      <div className="min-h-screen w-full bg-white text-black">
        <Navbar />
        <main className="w-full">
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
            
            {/* 404 Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
