import { Link } from 'react-router-dom';

export default function CartPage() {
  return (
    <main className="bg-zinc-50 px-5 py-16 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm shadow-zinc-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Bag
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          Cart functionality is coming later.
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          This page is a frontend placeholder. No cart state, checkout, or
          payment logic has been added yet.
        </p>
        <Link
          to="/products"
          className="mt-7 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
