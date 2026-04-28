export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5"
        aria-label="Primary navigation"
      >
        <a
          href="#top"
          className="shrink-0 text-sm font-semibold uppercase tracking-[0.22em] text-white sm:tracking-[0.24em]"
        >
          Luxora
        </a>

        <div className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 shadow-2xl shadow-black/20 backdrop-blur-xl md:flex md:gap-6">
          <a className="transition hover:text-white" href="#categories">
            Shop
          </a>
          <a className="transition hover:text-white" href="#featured">
            Featured
          </a>
          <a className="transition hover:text-white" href="#support">
            Support
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 shadow-lg shadow-black/20 backdrop-blur-xl sm:bg-transparent sm:p-0 sm:shadow-none">
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-4 sm:text-sm"
          >
            Search
          </button>
          <button
            type="button"
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80 sm:px-4 sm:text-sm"
          >
            Bag
          </button>
        </div>
      </nav>
    </header>
  );
}
