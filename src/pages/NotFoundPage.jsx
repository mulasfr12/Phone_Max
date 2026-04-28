import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm shadow-zinc-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          This page is outside the current edit.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
          The route may be unavailable in this frontend preview. Return to the
          storefront or continue browsing products.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
          >
            Back home
          </Link>
          <Link
            to="/products"
            className="inline-flex justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
          >
            Shop products
          </Link>
        </div>
      </section>
    </main>
  );
}
