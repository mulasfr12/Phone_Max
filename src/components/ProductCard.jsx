import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

function ProductVisual({ id }) {
  if (id === 'nova-fold') {
    return (
      <>
        <div className="absolute left-[22%] top-8 h-[78%] w-[28%] rounded-[1.7rem] border border-white/30 bg-white/10 p-1.5 shadow-[0_26px_70px_rgba(0,0,0,0.42)] backdrop-blur-md transition duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
          <div className="h-full rounded-[1.25rem] border border-white/10 bg-black/20" />
        </div>
        <div className="absolute right-[22%] top-8 h-[78%] w-[28%] rounded-[1.7rem] border border-white/30 bg-white/10 p-1.5 shadow-[0_26px_70px_rgba(0,0,0,0.42)] backdrop-blur-md transition duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
          <div className="h-full rounded-[1.25rem] border border-white/10 bg-black/20" />
        </div>
        <div className="absolute left-1/2 top-10 h-[70%] w-px -translate-x-1/2 bg-white/25" />
      </>
    );
  }

  if (id === 'arc-buds') {
    return (
      <>
        <div className="absolute left-1/2 top-[38%] h-24 w-44 -translate-x-1/2 rounded-[2rem] border border-white/30 bg-white/15 shadow-[0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-md transition duration-300 group-hover:translate-y-1" />
        <div className="absolute left-[34%] top-[26%] h-20 w-10 rounded-full border border-white/35 bg-white/15 shadow-xl shadow-black/30" />
        <div className="absolute right-[34%] top-[26%] h-20 w-10 rounded-full border border-white/35 bg-white/15 shadow-xl shadow-black/30" />
        <div className="absolute left-1/2 top-[52%] h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/35" />
      </>
    );
  }

  if (id === 'mag-dock') {
    return (
      <>
        <div className="absolute left-1/2 top-[38%] h-24 w-44 -translate-x-1/2 rounded-[2rem] border border-white/30 bg-white/10 shadow-[0_26px_70px_rgba(0,0,0,0.4)] backdrop-blur-md transition duration-300 group-hover:translate-y-1" />
        <div className="absolute left-[28%] top-[28%] h-16 w-16 rounded-full border border-white/35 bg-white/10" />
        <div className="absolute right-[28%] top-[22%] h-24 w-10 rounded-xl border border-white/25 bg-black/20" />
        <div className="absolute bottom-10 left-1/2 h-2 w-36 -translate-x-1/2 rounded-full bg-black/30" />
      </>
    );
  }

  return (
    <div className="absolute left-1/2 top-8 h-[78%] w-[46%] -translate-x-1/2 rounded-[2rem] border border-white/30 bg-white/10 p-1.5 shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-md transition duration-300 group-hover:translate-y-1">
      <div className="relative h-full overflow-hidden rounded-[1.55rem] border border-white/10 bg-black/20">
        <div className="mx-auto mt-3 h-2 w-12 rounded-full bg-black/45" />
        <div className="absolute -right-8 top-10 h-28 w-10 rotate-12 rounded-full bg-white/25 blur-xl" />
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-sm shadow-zinc-950/5 transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-950/10"
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${product.tone}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_16%,rgba(255,255,255,0.24),transparent_22%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <ProductVisual id={product.id} />
        <div className="absolute bottom-5 left-1/2 h-12 w-40 -translate-x-1/2 rounded-full bg-white/20 blur-xl" />
        <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
          Curated
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase text-zinc-500">
          {product.finish}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-zinc-950">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
          {product.spec}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
          <p className="text-base font-semibold text-zinc-950">
            {product.price}
          </p>
          <MotionLink
            to={`/products/${product.id}`}
            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            transition={{ duration: 0.16 }}
          >
            View
          </MotionLink>
        </div>
      </div>
    </motion.article>
  );
}
