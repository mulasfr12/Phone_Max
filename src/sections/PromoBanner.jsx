import { motion, useReducedMotion } from 'motion/react';

export default function PromoBanner() {
  const reduceMotion = useReducedMotion();
  const revealProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.28 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section className="bg-zinc-50 px-5 py-11 sm:px-8 sm:py-20">
      <motion.div
        className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-white/5 bg-[#08080a] text-white shadow-2xl shadow-zinc-950/15 lg:grid-cols-[0.95fr_1.05fr]"
        {...revealProps}
      >
        <div className="px-6 py-8 sm:p-10 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Launch edit
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-4xl">
            The travel-ready kit, composed for a cleaner carry.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            Pair a flagship phone with a protective case, compact charger, and
            studio-grade audio in a calm, curated bundle.
          </p>
          <a
            href="#featured"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80 sm:mt-7"
          >
            Explore the edit
          </a>
        </div>

        <motion.div
          className="relative min-h-72 overflow-hidden bg-[radial-gradient(circle_at_66%_26%,rgba(214,204,188,0.24),transparent_28%),linear-gradient(135deg,#151518,#303034_55%,#0f172a)] sm:min-h-80"
          whileInView={reduceMotion ? undefined : { scale: 1.01 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_48%,transparent_68%)]" />
          <div className="absolute left-[13%] top-12 h-60 w-28 rounded-[2.2rem] border border-white/30 bg-white/10 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md">
            <div className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20">
              <div className="absolute -right-8 top-8 h-28 w-12 rotate-12 rounded-full bg-white/20 blur-xl" />
              <div className="mx-auto mt-3 h-2 w-12 rounded-full bg-black/45" />
            </div>
          </div>
          <div className="absolute right-[14%] top-20 h-40 w-40 rounded-full border border-white/20 bg-white/10 shadow-2xl shadow-black/35 backdrop-blur-md">
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/15" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45" />
          </div>
          <div className="absolute right-[28%] top-24 h-28 w-8 rounded-full border border-white/20 bg-white/10" />
          <div className="absolute bottom-9 left-1/2 h-14 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
