import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/money.js';

const inputClassName =
  'mt-2 min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white';

export default function CheckoutPage() {
  const { items, itemCount, subtotal } = useCart();
  const [requestReference, setRequestReference] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preference: 'delivery',
    notes: '',
  });

  const referenceNumber = useMemo(
    () => `LX-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  const canSubmit =
    formData.fullName.trim().length > 1 &&
    formData.phone.trim().length > 5 &&
    Boolean(formData.preference);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setRequestReference(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setRequestReference(referenceNumber);
  }

  if (items.length === 0) {
    return (
      <main className="bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24">
        <section className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-zinc-200 bg-white text-center shadow-sm shadow-zinc-950/5">
          <div className="relative min-h-52 bg-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_20%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(135deg,rgba(39,39,42,0.95),rgba(9,9,11,1)_62%)]" />
            <div className="absolute left-1/2 top-12 h-28 w-28 -translate-x-1/2 rounded-[2rem] border border-white/25 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-md" />
            <div className="absolute bottom-8 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Checkout request
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
              Your request starts with a bag.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
              Add an item before previewing the local checkout request flow.
              No payment or account step has been added.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Shop products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-zinc-50 px-5 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Checkout request
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Reserve a polished order preview.
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            This is a frontend-only request flow. It collects local form input
            for the prototype and does not send data, process payment, or create
            an account.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Required: name, phone, delivery preference
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 sm:p-8"
          >
            {requestReference && (
              <div
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-semibold text-emerald-800">
                  Local request preview created.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  Reference {requestReference}. Nothing was submitted to a
                  server, and your cart is still available.
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-zinc-800">
                Full name <span className="text-zinc-500">(required)</span>
                <input
                  required
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Name for this request"
                  className={inputClassName}
                />
              </label>
              <label className="text-sm font-semibold text-zinc-800">
                Phone number <span className="text-zinc-500">(required)</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Best number for order follow-up"
                  className={inputClassName}
                />
              </label>
              <label className="text-sm font-semibold text-zinc-800">
                Email optional
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="For a copy of the request later"
                  className={inputClassName}
                />
              </label>
              <label className="text-sm font-semibold text-zinc-800">
                Delivery preference{' '}
                <span className="text-zinc-500">(required)</span>
                <select
                  required
                  name="preference"
                  value={formData.preference}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="delivery">Delivery request</option>
                  <option value="pickup">Boutique pickup request</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block text-sm font-semibold text-zinc-800">
              Notes
              <textarea
                name="notes"
                rows="5"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Preferred timing, finish questions, or bundle notes"
                className={`${inputClassName} resize-none py-3`}
              />
            </label>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
              No payment is processed here. This button only creates a local
              prototype confirmation in your browser.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
              >
                Submit local request
              </button>
              <Link
                to="/cart"
                className="inline-flex justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
              >
                Back to bag
              </Link>
            </div>
          </form>

          <aside className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Order summary
            </p>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b border-zinc-100 pb-4 last:border-b-0"
                >
                  <div
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${item.productSnapshot.tone}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_16%,rgba(255,255,255,0.22),transparent_26%)]" />
                    <div className="absolute left-1/2 top-3 h-10 w-5 -translate-x-1/2 rounded-md border border-white/30 bg-white/10" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-950">
                      {item.productSnapshot.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.productSnapshot.finish} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-950">
                    {formatPrice(
                      item.productSnapshot.priceCents,
                      item.productSnapshot.currency,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4 border-t border-zinc-100 pt-5 text-sm text-zinc-600">
              <div className="flex justify-between gap-4">
                <span>{itemCount} item total</span>
                <span className="font-semibold text-zinc-950">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Delivery</span>
                <span>Quoted later</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-zinc-950">
                Preview total
              </span>
              <span className="text-2xl font-semibold text-zinc-950">
                {formatPrice(subtotal)}
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
