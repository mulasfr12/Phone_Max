import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/money.js';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24">
        <section className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-zinc-200 bg-white text-center shadow-sm shadow-zinc-950/5">
          <div className="relative min-h-52 bg-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_20%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(135deg,rgba(39,39,42,0.95),rgba(9,9,11,1)_62%)]" />
            <div className="absolute left-1/2 top-12 h-28 w-28 -translate-x-1/2 rounded-[2rem] border border-white/25 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-md" />
            <div className="absolute bottom-8 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Bag
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
              Your bag is ready for a first piece.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
              Add phones, audio, charging, or everyday accessories from the
              current Luxora edit. Cart state stays local in this browser.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-zinc-50 px-5 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Bag
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Your Luxora bag.
            </h1>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} saved locally in
              this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="w-fit rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            Clear bag
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="space-y-4">
            {items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            ))}
          </div>

          <aside className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-950/5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Summary
            </p>
            <div className="mt-5 space-y-4 border-b border-zinc-100 pb-5 text-sm text-zinc-600">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-950">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Delivery</span>
                <span>Calculated later</span>
              </div>
              <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-500">
                Checkout is a local request preview. No payment will be taken.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-base font-semibold text-zinc-950">
                Estimated total
              </span>
              <span className="text-2xl font-semibold text-zinc-950">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-4"
            >
              Request checkout preview
            </Link>
            <Link
              to="/products"
              className="mt-3 inline-flex w-full justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

function CartLineItem({
  item,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
}) {
  const product = item.productSnapshot;

  return (
    <article className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 sm:grid-cols-[9rem_1fr] sm:p-5">
      <Link
        to={`/products/${item.productId}`}
        aria-label={`View ${product.name} details`}
        className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${product.tone}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_16%,rgba(255,255,255,0.24),transparent_24%)]" />
        <div className="absolute left-1/2 top-6 h-[72%] w-[42%] -translate-x-1/2 rounded-[1.5rem] border border-white/30 bg-white/10 shadow-xl shadow-black/30 backdrop-blur-md" />
        <div className="absolute bottom-4 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-white/20 blur-xl" />
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {product.finish}
          </p>
          <Link
            to={`/products/${item.productId}`}
            className="mt-2 block text-xl font-semibold text-zinc-950 transition hover:text-zinc-700"
          >
            {product.name}
          </Link>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            {product.spec}
          </p>
          <button
            type="button"
            onClick={() => removeFromCart(item.productId)}
            aria-label={`Remove ${product.name} from bag`}
            className="mt-4 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-lg font-semibold text-zinc-950">
            {formatPrice(product.priceCents, product.currency)}
          </p>
          <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-1">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.productId)}
              className="grid h-10 w-10 place-items-center rounded-full text-lg font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              aria-label={
                item.quantity === 1
                  ? `Remove ${product.name} from bag`
                  : `Decrease ${product.name} quantity`
              }
            >
              -
            </button>
            <span
              className="grid min-w-10 place-items-center text-sm font-semibold text-zinc-950"
              aria-live="polite"
              aria-label={`${product.name} quantity ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => increaseQuantity(item.productId)}
              className="grid h-10 w-10 place-items-center rounded-full text-lg font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
              aria-label={`Increase ${product.name} quantity`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
