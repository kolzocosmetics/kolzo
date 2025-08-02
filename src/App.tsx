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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
