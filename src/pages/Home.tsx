import HeroBanner from '../components/HeroBanner'
import FeaturedCollections from '../components/FeaturedCollections'
import GenderButtons from '../components/GenderButtons'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div className="w-full">
      <HeroBanner />
      <FeaturedCollections />
      <GenderButtons />
      <Newsletter />
    </div>
  )
}

export default Home