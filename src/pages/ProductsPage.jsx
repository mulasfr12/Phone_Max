import ProductCard from '../components/ProductCard.jsx';
import { featuredProducts } from '../data/homeData.js';

export default function ProductsPage() {
  return (
    <main className="bg-zinc-50 px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Shop
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-5xl">
            Curated devices and accessories.
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            Browse the current Luxora edit. Product data is local mock content
            until catalog and inventory services are introduced.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
