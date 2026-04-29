import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { mockOrderRequests } from '../../data/adminData.js';
import { formatPrice } from '../../utils/money.js';

const formatAdminLabel = (value) => value.replaceAll('_', ' ');

const orderColumns = [
  { key: 'id', label: 'Request' },
  { key: 'customerName', label: 'Customer' },
  { key: 'phone', label: 'Phone' },
  { key: 'itemsCount', label: 'Items' },
  {
    key: 'subtotalCents',
    label: 'Subtotal',
    render: (order) => formatPrice(order.subtotalCents, order.currency),
  },
  {
    key: 'paymentMethod',
    label: 'Payment',
    render: (order) => formatAdminLabel(order.paymentMethod),
  },
  {
    key: 'paymentStatus',
    label: 'Payment status',
    render: (order) => (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
        {formatAdminLabel(order.paymentStatus)}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (order) => (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
        {formatAdminLabel(order.status)}
      </span>
    ),
  },
];

export default function AdminOrdersPage() {
  return (
    <AdminShell
      eyebrow="Requests"
      title="Order request queue."
      description="Mock customer requests for admin workflow design. These rows are local sample data and are not connected to checkout submissions."
    >
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Order requests are mock/local for now. View and contacted actions are
        interface placeholders. Backend admin request endpoints now exist, but
        this screen is not connected to them yet and is not protected by auth.
      </div>
      <AdminTable
        label="Mock order request queue"
        columns={orderColumns}
        rows={mockOrderRequests}
        renderActions={(order) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-label={`View request ${order.id}`}
              className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            >
              View
            </button>
            <button
              type="button"
              aria-label={`Mark request ${order.id} contacted`}
              className="rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            >
              Mark contacted
            </button>
          </div>
        )}
      />
    </AdminShell>
  );
}
