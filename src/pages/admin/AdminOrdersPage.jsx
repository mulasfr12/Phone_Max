import { useEffect, useMemo, useState } from 'react';

import { ApiError } from '../../api/apiClient.js';
import {
  getAdminCheckoutRequests,
  updateCheckoutPaymentStatus,
  updateCheckoutRequestStatus,
} from '../../api/adminCheckoutRequestsApi.js';
import AdminShell from '../../components/admin/AdminShell.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { mockOrderRequests } from '../../data/adminData.js';
import { formatPrice } from '../../utils/money.js';

const formatAdminLabel = (value) => String(value || '').replaceAll('_', ' ');

const statusOptions = ['', 'pending', 'contacted', 'confirmed', 'fulfilled', 'cancelled'];
const paymentStatusOptions = ['', 'not_paid', 'awaiting_manual_confirmation', 'paid', 'rejected'];
const paymentMethodOptions = ['', 'pay_on_delivery', 'manual_lipa_payment'];

function normalizeOrderRequest(order) {
  return {
    ...order,
    itemsCount: order.itemsCount ?? order.items?.length ?? 0,
    requestedAt:
      order.requestedAt ??
      (order.createdAt
        ? new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(order.createdAt))
        : 'Not recorded'),
  };
}

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
    key: 'fulfillmentPreference',
    label: 'Fulfillment',
    render: (order) => formatAdminLabel(order.fulfillmentPreference || 'delivery'),
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
  { key: 'requestedAt', label: 'Created' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    paymentMethod: '',
  });
  const [status, setStatus] = useState({
    isLoading: true,
    isPreview: false,
    error: null,
    actionMessage: null,
  });

  useEffect(() => {
    let isActive = true;

    async function loadOrders() {
      setStatus((currentStatus) => ({
        ...currentStatus,
        isLoading: true,
        isPreview: false,
        error: null,
        actionMessage: null,
      }));

      try {
        const apiOrders = await getAdminCheckoutRequests(filters);

        if (!isActive) {
          return;
        }

        setOrders(apiOrders.map(normalizeOrderRequest));
        setStatus({
          isLoading: false,
          isPreview: false,
          error: null,
          actionMessage: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof ApiError) {
          setOrders([]);
          setStatus({
            isLoading: false,
            isPreview: false,
            error: error.message,
            actionMessage: null,
          });
          return;
        }

        setOrders(mockOrderRequests.map(normalizeOrderRequest));
        setStatus({
          isLoading: false,
          isPreview: true,
          error:
            error.message ||
            'The backend admin request queue is unavailable, so local preview data is shown.',
          actionMessage: null,
        });
      }
    }

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [filters]);

  const visibleOrders = useMemo(() => {
    if (!status.isPreview) {
      return orders;
    }

    return orders.filter((order) => {
      return (
        (!filters.status || order.status === filters.status) &&
        (!filters.paymentStatus ||
          order.paymentStatus === filters.paymentStatus) &&
        (!filters.paymentMethod || order.paymentMethod === filters.paymentMethod)
      );
    });
  }, [filters, orders, status.isPreview]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function replaceUpdatedOrder(updatedOrder) {
    const normalizedOrder = normalizeOrderRequest(updatedOrder);
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === normalizedOrder.id ? normalizedOrder : order,
      ),
    );
  }

  async function handleStatusUpdate(orderId, nextStatus) {
    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: `Updating ${orderId}...`,
    }));

    try {
      const updatedOrder = await updateCheckoutRequestStatus(orderId, nextStatus);
      replaceUpdatedOrder(updatedOrder);
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: `Request ${orderId} marked ${formatAdminLabel(nextStatus)}.`,
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage:
          error.message || `Could not update request ${orderId}.`,
      }));
    }
  }

  async function handlePaymentStatusUpdate(orderId, nextPaymentStatus) {
    setStatus((currentStatus) => ({
      ...currentStatus,
      actionMessage: `Updating payment for ${orderId}...`,
    }));

    try {
      const updatedOrder = await updateCheckoutPaymentStatus(
        orderId,
        nextPaymentStatus,
      );
      replaceUpdatedOrder(updatedOrder);
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage: `Payment for ${orderId} marked ${formatAdminLabel(
          nextPaymentStatus,
        )}.`,
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        actionMessage:
          error.message || `Could not update payment for ${orderId}.`,
      }));
    }
  }

  return (
    <AdminShell
      eyebrow="Requests"
      title="Order request queue."
      description="Review backend checkout requests when the API is running, with local preview data as a development fallback."
    >
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm shadow-zinc-950/5">
        Admin request endpoints are connected for local development, but they
        are still unprotected and not production-ready until auth is added.
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:grid-cols-3">
        <FilterSelect
          label="Status"
          name="status"
          value={filters.status}
          options={statusOptions}
          onChange={handleFilterChange}
        />
        <FilterSelect
          label="Payment status"
          name="paymentStatus"
          value={filters.paymentStatus}
          options={paymentStatusOptions}
          onChange={handleFilterChange}
        />
        <FilterSelect
          label="Payment method"
          name="paymentMethod"
          value={filters.paymentMethod}
          options={paymentMethodOptions}
          onChange={handleFilterChange}
        />
      </div>

      {status.isLoading && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-600 shadow-sm shadow-zinc-950/5">
          Loading checkout requests...
        </div>
      )}

      {!status.isLoading && status.isPreview && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <p className="font-semibold">Using local preview data.</p>
          <p className="mt-1">{status.error}</p>
        </div>
      )}

      {!status.isLoading && status.error && !status.isPreview && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">
          <p className="font-semibold">Could not load backend requests.</p>
          <p className="mt-1">{status.error}</p>
        </div>
      )}

      {status.actionMessage && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          {status.actionMessage}
        </div>
      )}

      <AdminTable
        label="Admin checkout request queue"
        columns={orderColumns}
        rows={visibleOrders}
        renderActions={(order) => (
          <OrderActions
            order={order}
            disabled={status.isPreview}
            onStatusUpdate={handleStatusUpdate}
            onPaymentStatusUpdate={handlePaymentStatusUpdate}
          />
        )}
      />

      {!status.isLoading && visibleOrders.length === 0 && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 shadow-sm shadow-zinc-950/5">
          No checkout requests match this view.
        </div>
      )}
    </AdminShell>
  );
}

function FilterSelect({ label, name, value, options, onChange }) {
  return (
    <label className="text-sm font-semibold text-zinc-800">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 min-h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-700 outline-none transition focus:border-zinc-500 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option || 'all'} value={option}>
            {option ? formatAdminLabel(option) : 'All'}
          </option>
        ))}
      </select>
    </label>
  );
}

function OrderActions({
  order,
  disabled,
  onStatusUpdate,
  onPaymentStatusUpdate,
}) {
  const statusTargets = ['contacted', 'confirmed', 'fulfilled', 'cancelled'];
  const paymentTargets = ['paid', 'rejected'];

  return (
    <div className="flex min-w-72 flex-col gap-3">
      {disabled && (
        <p className="text-xs leading-5 text-zinc-500">
          Preview data only. Actions are disabled.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {statusTargets.map((targetStatus) => (
          <button
            key={targetStatus}
            type="button"
            disabled={disabled || order.status === targetStatus}
            onClick={() => onStatusUpdate(order.id, targetStatus)}
            aria-label={`Mark request ${order.id} ${formatAdminLabel(
              targetStatus,
            )}`}
            className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {formatAdminLabel(targetStatus)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {paymentTargets.map((targetPaymentStatus) => (
          <button
            key={targetPaymentStatus}
            type="button"
            disabled={disabled || order.paymentStatus === targetPaymentStatus}
            onClick={() =>
              onPaymentStatusUpdate(order.id, targetPaymentStatus)
            }
            aria-label={`Mark payment for request ${order.id} ${formatAdminLabel(
              targetPaymentStatus,
            )}`}
            className="rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            Payment {formatAdminLabel(targetPaymentStatus)}
          </button>
        ))}
      </div>
    </div>
  );
}
