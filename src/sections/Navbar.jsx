export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
        aria-label="Primary navigation"
      >
        <a
          href="#top"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-white"
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/35 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            Search
          </button>
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            Bag
          </button>
        </div>
      </nav>
    </header>
  );
}
