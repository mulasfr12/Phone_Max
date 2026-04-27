import CategoryCard from '../components/CategoryCard.jsx';
import { categories } from '../data/homeData.js';

export default function CategoryGrid() {
  return (
    <section
      id="categories"
      className="bg-gradient-to-b from-zinc-50 to-white px-5 py-14 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Quick access
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 sm:text-4xl">
              Start with what you need.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-600">
            Clear paths into devices, protection, charging, audio, wearables,
            and essential upgrades.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
