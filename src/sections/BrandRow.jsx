import { motion, useReducedMotion } from 'motion/react';

import { brands } from '../data/homeData.js';

export default function BrandRow() {
  const reduceMotion = useReducedMotion();
  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section className="bg-zinc-50 px-5 py-8 sm:px-8 sm:py-10">
      <motion.div className="mx-auto max-w-7xl" {...revealProps}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Curated ecosystem
        </p>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 shadow-sm shadow-zinc-950/5 sm:mt-5 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand}
              className="bg-zinc-50 px-4 py-4 text-center text-sm font-semibold text-zinc-500 transition hover:bg-white hover:text-zinc-950 sm:py-5"
            >
              {brand}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
