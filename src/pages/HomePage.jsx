import BrandRow from '../sections/BrandRow.jsx';
import CategoryGrid from '../sections/CategoryGrid.jsx';
import FeaturedProducts from '../sections/FeaturedProducts.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import PromoBanner from '../sections/PromoBanner.jsx';
import TrustStrip from '../sections/TrustStrip.jsx';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <TrustStrip />
      <BrandRow />
    </>
  );
}
