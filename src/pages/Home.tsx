import HeroBanner from '../components/HeroBanner'
import FeaturedCollections from '../components/FeaturedCollections'
import GenderButtons from '../components/GenderButtons'
import Newsletter from '../components/Newsletter'
import SEOHead from '../components/SEOHead'

const Home = () => {
  return (
    <>
      <SEOHead 
        title="KOLZO - Luxury Fashion & Lifestyle | Premium Designer Clothing & Accessories"
        description="Discover KOLZO's exclusive luxury fashion collection. Shop designer handbags, premium accessories, luxury makeup, and sophisticated lifestyle products. Free shipping on orders over ₹16,600. Authentic luxury fashion."
        keywords="luxury fashion, designer handbags, premium accessories, luxury makeup, kolzo, designer clothing, luxury lifestyle, premium fashion, designer accessories, luxury brands, online shopping"
        image="https://kolzo.in/assets/kolzo_logo.png"
        type="website"
      />
      <div className="w-full">
        <HeroBanner />
        <FeaturedCollections />
        <GenderButtons />
        <Newsletter />
      </div>
    </>
  )
}

export default Home