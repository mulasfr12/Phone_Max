import ProductCard from '../components/ProductCard.jsx';
import { featuredProducts } from '../data/homeData.js';

export default function FeaturedProducts() {
  return (
    <section id="featured" className="bg-white px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-zinc-500">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 sm:text-4xl">
              Flagship picks, edited down.
            </h2>
          </div>
          <a
            href="#featured"
            className="text-sm font-semibold text-zinc-950 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
          >
            View all products
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
