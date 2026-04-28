import AdminShell from '../../components/admin/AdminShell.jsx';
import { categories } from '../../data/homeData.js';
import { products } from '../../data/products.js';

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      eyebrow="Merchandising"
      title="Category structure."
      description="A practical view of homepage category groups and local product counts."
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-zinc-600">
          Categories are local placeholders. Product counts are calculated from
          local product data.
        </p>
        <button
          type="button"
          aria-label="Add category placeholder"
          className="w-fit rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
        >
          Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const productCount = products.filter(
            (product) =>
              product.category.toLowerCase() === category.name.toLowerCase(),
          ).length;

          return (
            <article
              key={category.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5"
            >
              <div className={`h-20 bg-gradient-to-br ${category.tone}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-zinc-950">
                    {category.name}
                  </h2>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {productCount} products
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  {category.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
