export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-zinc-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(212,201,185,0.24),transparent_28%),radial-gradient(circle_at_20%_45%,rgba(125,149,174,0.22),transparent_28%),linear-gradient(135deg,#09090b_0%,#18181b_44%,#030303_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-zinc-950 to-transparent" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pt-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-400">
            Curated mobile luxury
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Phones and accessories with a quieter kind of power.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
            Luxora brings flagship devices, refined protection, and daily tech
            essentials into one calm shopping experience.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#featured"
              className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Shop featured
            </a>
            <a
              href="#categories"
              className="inline-flex justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              Browse categories
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[28rem] w-full max-w-md lg:h-[36rem]">
          <div className="absolute left-1/2 top-1/2 h-[25rem] w-48 -translate-x-1/2 -translate-y-1/2 rounded-[2.4rem] border border-white/25 bg-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-md sm:w-56 lg:h-[32rem] lg:w-64" />
          <div className="absolute left-1/2 top-[14%] h-3 w-20 -translate-x-1/2 rounded-full bg-black/45" />
          <div className="absolute left-[16%] top-[31%] h-64 w-28 rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm sm:left-[10%]" />
          <div className="absolute right-[8%] top-[42%] h-56 w-24 rounded-[1.6rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm sm:right-[2%]" />
          <div className="absolute bottom-10 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
