import { brands } from '../data/homeData.js';

export default function BrandRow() {
  return (
    <section className="bg-zinc-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Curated ecosystem
        </p>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 shadow-sm shadow-zinc-950/5 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand}
              className="bg-zinc-50 px-4 py-5 text-center text-sm font-semibold text-zinc-500 transition hover:bg-white hover:text-zinc-950"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
