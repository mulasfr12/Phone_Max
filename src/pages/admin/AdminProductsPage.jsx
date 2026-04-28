import { Link } from 'react-router-dom';

import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { products } from '../../data/products.js';

const productColumns = [
  {
    key: 'name',
    label: 'Product',
    render: (product) => (
      <div>
        <p className="font-semibold text-zinc-950">{product.name}</p>
        <p className="mt-1 text-xs text-zinc-500">{product.finish}</p>
      </div>
    ),
  },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  {
    key: 'inStock',
    label: 'Stock',
    render: (product) => (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          product.inStock
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-amber-50 text-amber-700'
        }`}
      >
        {product.inStock ? 'In stock' : 'Waitlist'}
      </span>
    ),
  },
];

export default function AdminProductsPage() {
  return (
    <AdminShell
      eyebrow="Catalog"
      title="Product management mockup."
      description="Review the local catalog and preview product pages. Edit actions are non-functional until a backend exists."
    >
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Product editing is frontend-only for now. Buttons below do not persist
        changes.
      </div>
      <AdminTable
        columns={productColumns}
        rows={products}
        renderActions={(product) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-label={`Edit ${product.name}`}
              className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            >
              Edit
            </button>
            <Link
              to={`/products/${product.id}`}
              aria-label={`Preview ${product.name}`}
              className="rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            >
              Preview
            </Link>
          </div>
        )}
      />
    </AdminShell>
  );
}
