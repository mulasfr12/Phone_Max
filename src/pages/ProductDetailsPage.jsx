import { Link, useParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import { formatPrice } from '../utils/money.js';

function DetailProductVisual({ product }) {
  const visualBase =
    'absolute border border-white/30 bg-white/10 shadow-[0_34px_90px_rgba(0,0,0,0.44)] backdrop-blur-md';

  return (
    <div
      className={`relative min-h-[28rem] overflow-hidden rounded-lg bg-gradient-to-br ${product.tone} shadow-2xl shadow-zinc-950/15`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_16%,rgba(255,255,255,0.24),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute inset-x-10 top-9 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {product.visual === 'fold' && (
        <>
          <div
            className={`${visualBase} left-[17%] top-16 h-[66%] w-[31%] rounded-[2rem] p-2`}
          >
            <div className="h-full rounded-[1.45rem] border border-white/10 bg-black/25" />
          </div>
          <div
            className={`${visualBase} right-[17%] top-16 h-[66%] w-[31%] rounded-[2rem] p-2`}
          >
            <div className="h-full rounded-[1.45rem] border border-white/10 bg-black/25" />
          </div>
          <div className="absolute left-1/2 top-20 h-[58%] w-px -translate-x-1/2 bg-white/25" />
        </>
      )}

      {product.visual === 'buds' && (
        <>
          <div
            className={`${visualBase} left-1/2 top-[45%] h-28 w-56 -translate-x-1/2 rounded-[2.2rem]`}
          />
          <div className={`${visualBase} left-[32%] top-[23%] h-28 w-12 rounded-full`} />
          <div className={`${visualBase} right-[32%] top-[23%] h-28 w-12 rounded-full`} />
          <div className="absolute left-1/2 top-[58%] h-1.5 w-20 -translate-x-1/2 rounded-full bg-black/35" />
        </>
      )}

      {product.visual === 'dock' && (
        <>
          <div
            className={`${visualBase} left-1/2 top-[44%] h-28 w-60 -translate-x-1/2 rounded-[2.4rem]`}
          />
          <div className={`${visualBase} left-[27%] top-[28%] h-20 w-20 rounded-full`} />
          <div className={`${visualBase} right-[27%] top-[20%] h-32 w-14 rounded-2xl bg-black/20`} />
        </>
      )}

      {product.visual === 'case' && (
        <div
          className={`${visualBase} left-1/2 top-14 h-[70%] w-[42%] -translate-x-1/2 rounded-[2.35rem] p-2`}
        >
          <div className="relative h-full rounded-[1.8rem] border border-white/20 bg-black/10">
            <div className="absolute left-4 top-4 h-16 w-16 rounded-2xl border border-white/25 bg-black/20" />
            <div className="absolute inset-x-10 bottom-7 h-1 rounded-full bg-white/25" />
          </div>
        </div>
      )}

      {product.visual === 'wearable' && (
        <>
          <div className="absolute left-1/2 top-16 h-72 w-24 -translate-x-1/2 rounded-full border border-white/25 bg-white/10 shadow-[0_34px_90px_rgba(0,0,0,0.4)] backdrop-blur-md" />
          <div
            className={`${visualBase} left-1/2 top-[35%] h-28 w-28 -translate-x-1/2 rounded-[2rem] p-2`}
          >
            <div className="h-full rounded-[1.45rem] border border-white/10 bg-black/25" />
          </div>
        </>
      )}

      {product.visual === 'phone' && (
        <div
          className={`${visualBase} left-1/2 top-12 h-[74%] w-[43%] -translate-x-1/2 rounded-[2.45rem] p-2`}
        >
          <div className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/25">
            <div className="mx-auto mt-4 h-2 w-16 rounded-full bg-black/45" />
            <div className="absolute -right-10 top-12 h-44 w-14 rotate-12 rounded-full bg-white/25 blur-xl" />
            <div className="absolute left-4 top-4 h-16 w-16 rounded-2xl border border-white/25 bg-white/10">
              <div className="m-2 h-4 w-4 rounded-full bg-black/35" />
              <div className="ml-8 h-4 w-4 rounded-full bg-black/35" />
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 h-16 w-64 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
        {product.category}
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <main className="bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24">
        <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm shadow-zinc-950/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Product unavailable
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            This product is not in the current edit.
          </h1>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
          >
            Back to products
          </Link>
        </section>
      </main>
    );
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  return (
    <main className="bg-zinc-50 px-5 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <DetailProductVisual product={product} />

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {product.category}
            </p>
            <p
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.inStock
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {product.inStock ? 'In stock' : 'Coming back soon'}
            </p>
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {product.finish}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
            {product.shortDescription}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {product.spec}
          </p>
          <p className="mt-6 text-2xl font-semibold text-zinc-950">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          <div className="mt-8 border-t border-zinc-100 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Included highlights
            </h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-700 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-950" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => addToCart(product)}
              aria-label={
                product.inStock
                  ? `Add ${product.name} to bag`
                  : `${product.name} is currently unavailable`
              }
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
            >
              {product.inStock ? 'Add to Bag' : 'Currently unavailable'}
            </button>
            <Link
              to="/products"
              className="inline-flex justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Back to products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl sm:mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Related
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
              Complete the setup.
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 sm:inline-flex"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </main>
  );
}
