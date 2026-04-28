import { motion, useReducedMotion } from 'motion/react';

import CategoryCard from '../components/CategoryCard.jsx';
import { categories } from '../data/homeData.js';

export default function CategoryGrid() {
  const reduceMotion = useReducedMotion();
  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section
      id="categories"
      className="bg-gradient-to-b from-zinc-50 to-white px-5 py-11 sm:px-8 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          {...revealProps}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Quick access
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950 sm:text-4xl">
              Start with what you need.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-600">
            Clear paths into devices, protection, charging, audio, wearables,
            and essential upgrades.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
