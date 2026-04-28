import { Link, useLocation } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const isHome = pathname === '/';

  return (
    <header
      className={
        isHome
          ? 'absolute inset-x-0 top-0 z-20'
          : 'sticky inset-x-0 top-0 z-20 border-b border-white/10 bg-zinc-950'
      }
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5"
        aria-label="Primary navigation"
      >
        <Link
          to="/"
          className="shrink-0 text-sm font-semibold uppercase tracking-[0.22em] text-white sm:tracking-[0.24em]"
        >
          Luxora
        </Link>

        <div className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 shadow-2xl shadow-black/20 backdrop-blur-xl md:flex md:gap-6">
          <Link className="transition hover:text-white" to="/products">
            Shop
          </Link>
          <Link className="transition hover:text-white" to="/#featured">
            Featured
          </Link>
          <Link className="transition hover:text-white" to="/support">
            Support
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 shadow-lg shadow-black/20 backdrop-blur-xl sm:bg-transparent sm:p-0 sm:shadow-none">
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-4 sm:text-sm"
          >
            Search
          </button>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-4 sm:text-sm"
          >
            Bag
            {itemCount > 0 && (
              <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-zinc-950 px-1 text-[0.68rem] leading-none text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
