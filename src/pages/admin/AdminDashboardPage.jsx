import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminStatCard from '../../components/admin/AdminStatCard.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { mockInventoryNotes, mockOrderRequests } from '../../data/adminData.js';
import { categories } from '../../data/homeData.js';
import { products } from '../../data/products.js';
import { formatPrice } from '../../utils/money.js';

const formatAdminLabel = (value) => value.replaceAll('_', ' ');

const orderColumns = [
  { key: 'id', label: 'Request' },
  { key: 'customerName', label: 'Customer' },
  { key: 'itemsCount', label: 'Items' },
  {
    key: 'subtotalCents',
    label: 'Subtotal',
    render: (row) => formatPrice(row.subtotalCents, row.currency),
  },
  {
    key: 'paymentStatus',
    label: 'Payment',
    render: (row) => formatAdminLabel(row.paymentStatus),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
        {formatAdminLabel(row.status)}
      </span>
    ),
  },
];

export default function AdminDashboardPage() {
  const pendingOrders = mockOrderRequests.filter(
    (order) => order.status === 'pending',
  );
  const revenueEstimate = mockOrderRequests.reduce(
    (total, order) => total + order.subtotalCents,
    0,
  );

  return (
    <AdminShell
      eyebrow="Operations overview"
      title="Storefront control room."
      description="A local-only admin dashboard for reviewing catalog shape, request volume, and operational placeholders."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Products"
          value={products.length}
          detail="Local mock catalog items."
        />
        <AdminStatCard
          label="Categories"
          value={categories.length}
          detail="Homepage category groups."
        />
        <AdminStatCard
          label="Pending requests"
          value={pendingOrders.length}
          detail="Mock requests needing follow-up."
        />
        <AdminStatCard
          label="Revenue estimate"
          value={formatPrice(revenueEstimate)}
          detail="Mock subtotal value only."
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-950">
              Recent order requests
            </h2>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Mock data
            </p>
          </div>
          <AdminTable
            label="Recent mock order requests"
            columns={orderColumns}
            rows={mockOrderRequests.slice(0, 3)}
          />
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5">
          <h2 className="text-lg font-semibold text-zinc-950">
            Low-stock notes
          </h2>
          <div className="mt-4 space-y-4">
            {mockInventoryNotes.map((note) => {
              const product = products.find(
                (item) => item.id === note.productId,
              );

              return (
                <article
                  key={note.productId}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-sm font-semibold text-zinc-950">
                    {product?.name ?? note.productId}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {note.stockLabel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {note.note}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
