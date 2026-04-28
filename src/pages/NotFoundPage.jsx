import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="bg-zinc-50 px-5 py-16 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm shadow-zinc-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
          This page is outside the current edit.
        </h1>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
