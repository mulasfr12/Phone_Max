export default function PromoBanner() {
  return (
    <section className="bg-zinc-50 px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg bg-zinc-950 text-white lg:grid-cols-[0.95fr_1.05fr]">
        <div className="px-6 py-10 sm:p-10 lg:p-14">
          <p className="text-sm font-medium uppercase text-zinc-400">
            Launch edit
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            The travel-ready kit for a cleaner carry.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            Pair a flagship phone with a protective case, compact charger, and
            studio-grade audio in a calm, curated bundle.
          </p>
          <a
            href="#featured"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            Explore the edit
          </a>
        </div>

        <div className="relative min-h-72 overflow-hidden bg-[radial-gradient(circle_at_60%_30%,rgba(214,204,188,0.28),transparent_30%),linear-gradient(135deg,#18181b,#3f3f46_55%,#111827)]">
          <div className="absolute left-[18%] top-12 h-56 w-28 rounded-[2rem] border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md" />
          <div className="absolute right-[14%] top-20 h-40 w-40 rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md" />
          <div className="absolute bottom-9 left-1/2 h-14 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
