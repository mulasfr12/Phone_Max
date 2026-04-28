import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext.jsx';

export default function CartToast() {
  const reduceMotion = useReducedMotion();
  const { notification, dismissNotification } = useCart();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-96"
    >
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notification.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto overflow-hidden rounded-lg border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-zinc-950/30"
            role="status"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.16),transparent_30%)]" />
            <div className="relative flex gap-4 p-4">
              <div className="mt-1 h-10 w-10 shrink-0 rounded-full border border-white/15 bg-white/10" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Added to Bag</p>
                <p className="mt-1 truncate text-sm text-zinc-300">
                  {notification.productName}
                </p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {notification.finish}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    to="/cart"
                    onClick={dismissNotification}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    View bag
                  </Link>
                  <button
                    type="button"
                    onClick={dismissNotification}
                    className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80"
                  >
                    Keep shopping
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
