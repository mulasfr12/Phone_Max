import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiError } from '../api/apiClient.js';
import { createCheckoutRequest } from '../api/checkoutRequestsApi.js';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/money.js';

const inputClassName =
  'mt-2 min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white';

export default function CheckoutPage() {
  const { items, itemCount, subtotal } = useCart();
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    mode: null,
    reference: null,
    message: null,
  });
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preference: 'delivery',
    paymentMethod: 'pay_on_delivery',
    notes: '',
  });

  const referenceNumber = useMemo(
    () => `LX-${Math.floor(100000 + Math.random() * 900000)}`,
    [],
  );

  const canSubmit =
    formData.fullName.trim().length > 1 &&
    formData.phone.trim().length > 5 &&
    Boolean(formData.preference) &&
    Boolean(formData.paymentMethod);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setSubmissionState({
      isSubmitting: false,
      mode: null,
      reference: null,
      message: null,
    });
  }

  function buildCheckoutPayload() {
    return {
      customerName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      fulfillmentPreference: formData.preference,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim() || null,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  }

  function getValidationMessage(error) {
    const errors = error.details?.errors;

    if (Array.isArray(errors)) {
      return errors.join(' ');
    }

    if (errors && typeof errors === 'object') {
      return Object.values(errors).flat().join(' ');
    }

    return error.message || 'Please check the request details and try again.';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit || submissionState.isSubmitting) {
      return;
    }

    setSubmissionState({
      isSubmitting: true,
      mode: null,
      reference: null,
      message: null,
    });

    try {
      const checkoutRequest = await createCheckoutRequest(buildCheckoutPayload());

      setSubmissionState({
        isSubmitting: false,
        mode: 'api',
        reference: checkoutRequest.id,
        message:
          'Your checkout request was created in the backend. Your bag is still available.',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmissionState({
          isSubmitting: false,
          mode: 'error',
          reference: null,
          message: getValidationMessage(error),
        });
        return;
      }

      setSubmissionState({
        isSubmitting: false,
        mode: 'local',
        reference: referenceNumber,
        message:
          'Saved locally for preview only. The backend could not be reached, so nothing was submitted to the server.',
      });
    }
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
              No online payment, account step, or server submission has been
              added.
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
            Required: name, phone, delivery preference, payment method
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/5 sm:p-8"
          >
            {submissionState.mode === 'api' && (
              <div
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-semibold text-emerald-800">
                  Checkout request created.
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  Reference {submissionState.reference}.{' '}
                  {submissionState.message}
                </p>
              </div>
            )}

            {submissionState.mode === 'local' && (
              <div
                className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-semibold text-amber-800">
                  Local request preview saved.
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Reference {submissionState.reference}.{' '}
                  {submissionState.message}
                </p>
              </div>
            )}

            {submissionState.mode === 'error' && (
              <div
                className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4"
                role="alert"
                aria-live="assertive"
              >
                <p className="text-sm font-semibold text-rose-800">
                  Checkout request needs attention.
                </p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  {submissionState.message}
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
              <label className="text-sm font-semibold text-zinc-800">
                Payment method <span className="text-zinc-500">(required)</span>
                <select
                  required
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="pay_on_delivery">Pay on delivery</option>
                  <option value="manual_lipa_payment">
                    Manual LIPA payment
                  </option>
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
              No online payment is processed here. Pay on delivery is settled
              in person; manual LIPA payments would require admin confirmation
              later. Luxora sends only item ids and quantities to the backend;
              totals are calculated by the server.
            </div>

            {formData.paymentMethod === 'manual_lipa_payment' && (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600">
                Manual LIPA payment is a request option only. Use the store LIPA
                number and instructions provided by staff after confirmation;
                payment is not automatically verified.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={!canSubmit || submissionState.isSubmitting}
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
              >
                {submissionState.isSubmitting
                  ? 'Submitting request...'
                  : 'Submit checkout request'}
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
