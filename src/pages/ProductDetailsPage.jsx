import { Link, useParams } from 'react-router-dom';

import { featuredProducts } from '../data/homeData.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = featuredProducts.find((item) => item.id === id);

  if (!product) {
    return (
      <main className="bg-zinc-50 px-5 py-16 sm:px-8">
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

  return (
    <main className="bg-zinc-50 px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          className={`relative min-h-96 overflow-hidden rounded-lg bg-gradient-to-br ${product.tone} shadow-2xl shadow-zinc-950/15`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_16%,rgba(255,255,255,0.24),transparent_22%)]" />
          <div className="absolute left-1/2 top-10 h-[78%] w-[46%] -translate-x-1/2 rounded-[2.4rem] border border-white/30 bg-white/10 p-2 shadow-[0_34px_90px_rgba(0,0,0,0.42)] backdrop-blur-md">
            <div className="relative h-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-black/20">
              <div className="mx-auto mt-4 h-2 w-16 rounded-full bg-black/45" />
              <div className="absolute -right-10 top-12 h-40 w-14 rotate-12 rounded-full bg-white/25 blur-xl" />
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 h-16 w-60 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {product.finish}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-zinc-600">
            {product.spec}. This detail page is a static frontend placeholder
            for the future product experience.
          </p>
          <p className="mt-6 text-2xl font-semibold text-zinc-950">
            {product.price}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Cart coming later
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
    </main>
  );
}
