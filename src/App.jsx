import BrandRow from './sections/BrandRow.jsx';
import CategoryGrid from './sections/CategoryGrid.jsx';
import FeaturedProducts from './sections/FeaturedProducts.jsx';
import Footer from './sections/Footer.jsx';
import HeroSection from './sections/HeroSection.jsx';
import Navbar from './sections/Navbar.jsx';
import PromoBanner from './sections/PromoBanner.jsx';
import TrustStrip from './sections/TrustStrip.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <TrustStrip />
        <BrandRow />
      </main>
      <Footer />
    </>
  );
}
