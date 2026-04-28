import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

const categoryChips = [
  'All',
  'Phones',
  'Cases',
  'Charging',
  'Audio',
  'Wearables',
];

export default function ProductsPage() {
  return (
    <main className="bg-zinc-50">
      <section className="relative overflow-hidden bg-zinc-950 px-5 pb-12 pt-16 text-white sm:px-8 sm:pb-16 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(39,39,42,0.9),rgba(9,9,11,1)_58%)]" />
        <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Shop the edit
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Devices and accessories, edited for daily luxury.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Browse phones, protection, audio, charging, and wearable pieces
              with the same restrained Luxora visual language as the homepage.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-300 backdrop-blur-md sm:min-w-80">
            <div>
              <p className="text-2xl font-semibold text-white">
                {products.length}
              </p>
              <p className="mt-1">Curated items</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Local</p>
              <p className="mt-1">Mock catalog</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryChips.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    category === 'All'
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:w-[30rem]">
              <label className="sr-only" htmlFor="product-search">
                Search products
              </label>
              <input
                id="product-search"
                type="search"
                placeholder="Search Luxora products"
                className="min-h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white"
              />
              <label className="sr-only" htmlFor="product-sort">
                Sort products
              </label>
              <select
                id="product-sort"
                className="min-h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-700 outline-none transition focus:border-zinc-500 focus:bg-white"
                defaultValue="featured"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Filters are visual placeholders until catalog logic is added.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
