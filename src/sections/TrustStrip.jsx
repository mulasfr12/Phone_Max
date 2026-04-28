import { motion, useReducedMotion } from 'motion/react';

import TrustItem from '../components/TrustItem.jsx';
import { trustItems } from '../data/homeData.js';

export default function TrustStrip() {
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
    <section id="support" className="bg-white px-5 py-7 sm:px-8 sm:py-10">
      <motion.div
        className="mx-auto grid max-w-7xl gap-4 border-y border-zinc-200 py-6 sm:grid-cols-2 sm:gap-6 sm:py-7 lg:grid-cols-4"
        {...revealProps}
      >
        {trustItems.map((item) => (
          <TrustItem key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
